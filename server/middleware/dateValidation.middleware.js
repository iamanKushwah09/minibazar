const logger = require('../utils/logger');
const dayjs = require('dayjs');

/**
 * Date Range Validation Middleware
 * Validates startDate and endDate query parameters for date range filtering
 */
const validateDateRange = (req, res, next) => {
    const { startDate, endDate } = req.query;
    const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info(`[${requestId}] Date range validation started`, {
        query: req.query,
        method: req.method,
        url: req.originalUrl
    });

    try {
        // If no date parameters provided, skip validation
        if (!startDate && !endDate) {
            logger.info(`[${requestId}] No date parameters provided, proceeding without date filtering`);
            return next();
        }

        const validationErrors = [];
        const validatedDates = {};

        // Validate and parse startDate
        if (startDate) {
            const parsedStartDate = parseAndValidateDate(startDate, 'startDate', validationErrors);
            if (parsedStartDate) {
                validatedDates.startDate = parsedStartDate;
            }
        }

        // Validate and parse endDate
        if (endDate) {
            const parsedEndDate = parseAndValidateDate(endDate, 'endDate', validationErrors);
            if (parsedEndDate) {
                validatedDates.endDate = parsedEndDate;
            }
        }

        // Validate date range logic
        if (validatedDates.startDate && validatedDates.endDate) {
            if (validatedDates.startDate > validatedDates.endDate) {
                validationErrors.push('Start date must be before or equal to end date');
                logger.warn(`[${requestId}] Invalid date range: startDate > endDate`, {
                    startDate: validatedDates.startDate.toISOString(),
                    endDate: validatedDates.endDate.toISOString()
                });
            }

            // Check for reasonable date range (prevent queries spanning too long periods)
            const maxRangeDays = 365; // Allow maximum 1 year range
            const rangeInDays = (validatedDates.endDate - validatedDates.startDate) / (1000 * 60 * 60 * 24);
            if (rangeInDays > maxRangeDays) {
                validationErrors.push(`Date range cannot exceed ${maxRangeDays} days`);
                logger.warn(`[${requestId}] Date range too large: ${rangeInDays} days`, {
                    startDate: validatedDates.startDate.toISOString(),
                    endDate: validatedDates.endDate.toISOString(),
                    rangeInDays
                });
            }
        }

        // If validation errors found, return error response
        if (validationErrors.length > 0) {
            logger.warn(`[${requestId}] Date validation failed`, {
                errors: validationErrors,
                providedParams: { startDate, endDate }
            });

            return res.status(400).json({
                success: false,
                error: 'INVALID_DATE_RANGE',
                message: 'Invalid date parameters provided',
                details: {
                    errors: validationErrors,
                    examples: {
                        validFormats: [
                            'YYYY-MM-DD (2023-12-31)',
                            'YYYY-MM-DDTHH:mm:ss.sssZ (2023-12-31T23:59:59.999Z)',
                            'YYYY-MM-DDTHH:mm:ssZ (2023-12-31T23:59:59Z)'
                        ],
                        validRanges: 'Start date should be less than or equal to end date',
                        maxRange: 'Date range should not exceed 365 days'
                    }
                },
                timestamp: new Date().toISOString(),
                requestId
            });
        }

        // Attach validated dates to request object for use in controller
        req.validatedDates = validatedDates;
        req.requestId = requestId;

        logger.info(`[${requestId}] Date validation successful`, {
            validatedDates: Object.keys(validatedDates).reduce((acc, key) => {
                acc[key] = validatedDates[key].toISOString();
                return acc;
            }, {}),
            processingTime: Date.now() - parseInt(requestId.split('_')[1])
        });

        next();

    } catch (error) {
        logger.error(`[${requestId}] Unexpected error in date validation middleware`, {
            error: error.message,
            stack: error.stack,
            query: req.query
        });

        return res.status(500).json({
            success: false,
            error: 'DATE_VALIDATION_ERROR',
            message: 'An unexpected error occurred during date validation',
            timestamp: new Date().toISOString(),
            requestId
        });
    }
};

/**
 * Parse and validate individual date string
 */
const parseAndValidateDate = (dateString, fieldName, errors) => {
    const supportedFormats = [
        'YYYY-MM-DD',
        'YYYY-MM-DDTHH:mm:ss.sssZ',
        'YYYY-MM-DDTHH:mm:ssZ',
        'YYYY-MM-DDTHH:mm:ss',
        'YYYY-MM-DDTHH:mm',
        'MM/DD/YYYY',
        'DD/MM/YYYY'
    ];

    // Try to parse the date using dayjs with multiple formats
    let parsedDate = null;
    
    for (const format of supportedFormats) {
        const date = dayjs(dateString, format, true);
        if (date.isValid()) {
            // For date-only formats, set to end of day (23:59:59.999)
            if (format === 'YYYY-MM-DD') {
                parsedDate = date.endOf('day').toDate();
            } else {
                parsedDate = date.toDate();
            }
            break;
        }
    }

    if (!parsedDate) {
        // Try native Date parsing as fallback
        const nativeDate = new Date(dateString);
        if (!isNaN(nativeDate.getTime())) {
            parsedDate = nativeDate;
        } else {
            errors.push(`${fieldName}: Invalid date format '${dateString}'. Supported formats: ${supportedFormats.join(', ')}`);
            return null;
        }
    }

    // Additional validations
    const now = new Date();
    const minDate = new Date('2020-01-01'); // Allow dates from 2020 onwards
    
    // Allow dates up to 30 days in the future for filtering purposes
    const maxFilterDate = new Date(now);
    maxFilterDate.setDate(maxFilterDate.getDate() + 30);
    
    if (parsedDate < minDate) {
        errors.push(`${fieldName}: Date '${dateString}' is too early. Minimum supported date is ${minDate.toISOString().split('T')[0]}`);
        return null;
    }
    
    if (parsedDate > maxFilterDate) {
        errors.push(`${fieldName}: Date '${dateString}' is too far in the future. Maximum allowed date is ${maxFilterDate.toISOString().split('T')[0]}`);
        return null;
    }

    return parsedDate;
};

/**
 * Utility function to build MongoDB date range query
 */
const buildDateRangeQuery = (validatedDates) => {
    if (!validatedDates) return {};

    const query = {};

    if (validatedDates.startDate && validatedDates.endDate) {
        // Include the entire end date by setting to end of day
        const endDateInclusive = new Date(validatedDates.endDate);
        endDateInclusive.setHours(23, 59, 59, 999);
        
        query.date = {
            $gte: validatedDates.startDate,
            $lte: endDateInclusive
        };
    } else if (validatedDates.startDate) {
        query.date = {
            $gte: validatedDates.startDate
        };
    } else if (validatedDates.endDate) {
        const endDateInclusive = new Date(validatedDates.endDate);
        endDateInclusive.setHours(23, 59, 59, 999);
        
        query.date = {
            $lte: endDateInclusive
        };
    }

    return query;
};

module.exports = {
    validateDateRange,
    buildDateRangeQuery
};