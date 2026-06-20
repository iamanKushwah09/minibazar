import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import useSaleOrderSubmit from "@/hooks/useSaleOrderSubmit";
import CustomerServices from "@/services/CustomerServices";
import useAsync from "@/hooks/useAsync";
import SearchableDropdown from "@/pages/SearchableDropdown";
import SalesmanServices from "@/services/SalesmanServices";
import ItemServices from "@/services/ItemServices";
import SaleOrderServices from "@/services/SaleOrderServices";
import SaleTypeServices from "@/services/SaleTypeServices";
import SundryDiscountService from "@/services/SundryDiscountServices";
import { notifyError } from "@/utils/toast";
import { SidebarContext } from "@/context/SidebarContext";
import { set } from "date-fns";
import UnitServices from "@/services/UnitServices";
import ItemDiscountServices from "@/services/ItemsDiscountServices";
import ItemSearchableDropdown from "@/pages/ItemSearchableDropdown";
import { AdminContext } from "@/context/AdminContext";
import AttributeValueServices from "@/services/AttributeValueServices";


const SaleOrderDrawer = ({ id, isViewOnly = false }) => {
  const { isDrawerOpen } = useContext(SidebarContext);
  const { state: adminState } = useContext(AdminContext);
  const { adminInfo } = adminState;

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    handleSelectLanguage,
  } = useSaleOrderSubmit(id);

  const { t } = useTranslation();
  const [items, setItems] = useState([{
    image: '',
    name: '',
    itemId: '',
    hsn: '',
    quantity: '',
    unit: null,
    listPrice: '',
    discount: '',
    totalDiscount: '',
    price: '',
    amount: '',
    color: '',
    size: '',
    variantColors: [],
    variantSizes: []
  }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalHammli, setTotalHammli] = useState(0);
  const [totalCgstSundries, setTotalCgstSundries] = useState(0);
  const [totalSgstSundries, setTotalSgstSundries] = useState(0);
  const [totalIgstSundries, setTotalIgstSundries] = useState(0);
  const [totalDiscountSundries, setTotalDiscountSundries] = useState(0);
  const [totalNetAmount, setNetAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [voucherNo, setVoucherNo] = useState('');
  const [saleType, setSaleType] = useState('L/GST-voucher(12%)');
  const [matCentre, setMatCentre] = useState('RETAIL');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [getParty, setParty] = useState(null);
  const [getPartyObject, setPartyObject] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemCode, setItemCode] = useState(null);
  const [selectedSaleType, setSelectedSaleType] = useState(null);
  const [itemDiscount, setItemDiscount] = useState(0);
  const [vendorDiscount, setVendorDiscount] = useState(0);
  const [hammaliDiscount, setHammaliDiscount] = useState(0);
  const [isCentralSale, setIsCentralSale] = useState(false);
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);


  const [customerList, setCustomerList] = useState([]);
  const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);
  const [customerPage, setCustomerPage] = useState(1);
  const [hasMoreCustomers, setHasMoreCustomers] = useState(false);
  const [loadingMoreCustomers, setLoadingMoreCustomers] = useState(false);

  const { data: customerData } = useAsync(async () => {
    const res = await CustomerServices.activeCustomer("", { params: { group_type: "Vendor" } });
    setCustomerList(res.data || []);
    setHasMoreCustomers(res.pagination?.hasNext || false);
    setCustomerPage(1);
    return res.data;
  });

  const handleSearchCustomers = useCallback(async (query) => {
    setIsSearchingCustomers(true);
    try {
      const res = await CustomerServices.activeCustomer(query, { params: { page: 1, limit: 100, group_type: "Vendor" } });
      setCustomerList(res.data || []);
      setHasMoreCustomers(res.pagination?.hasNext || false);
      setCustomerPage(1);
    } catch (error) {
      console.error("Error searching customers:", error);
    } finally {
      setIsSearchingCustomers(false);
    }
  }, []);

  const handleLoadMoreCustomers = useCallback(async (query) => {
    if (loadingMoreCustomers || !hasMoreCustomers) return;
    setLoadingMoreCustomers(true);
    try {
      const nextPage = customerPage + 1;
      const res = await CustomerServices.activeCustomer(query, { params: { page: nextPage, limit: 100, group_type: "Vendor" } });
      setCustomerList(prev => [...prev, ...(res.data || [])]);
      setHasMoreCustomers(res.pagination?.hasNext || false);
      setCustomerPage(nextPage);
    } catch (error) {
      console.error("Error loading more customers:", error);
    } finally {
      setLoadingMoreCustomers(false);
    }
  }, [customerPage, hasMoreCustomers, loadingMoreCustomers]);

  const customerOptions = useMemo(() => {
    return customerList?.map((item) => ({
      value: item._id,
      label: item.name,
      code: item.code,
      print_name: item.print_name
    })) || [];
  }, [customerList]);
  const { data: salesmanData } = useAsync(() => SalesmanServices.activeAllSaleman());
  const { data: activeItems } = useAsync(() => ItemServices.getActiveItem());
  // const { data: activeSaleType } = useAsync(() => SaleTypeServices.getActiveSaleType());
  const { data: someSaleType } = useAsync(() => SaleTypeServices.getSomeSaleTypes());
  const { data: unitData } = useAsync(() => UnitServices.getActiveUnit());


  const { data: attributeValuesData } = useAsync(() => AttributeValueServices.getByAttributeValueByValue());

  useEffect(() => {
    if (attributeValuesData) {
      const colors = attributeValuesData.find(attr => attr.name?.toLowerCase() === 'color')?.groupArr || [];
      const sizes = attributeValuesData.find(attr => attr.name?.toLowerCase() === 'size')?.groupArr || [];

      setColorOptions(colors.map(c => ({ value: c.attribute_id, label: c.name })));
      setSizeOptions(sizes.map(s => ({ value: s.attribute_id, label: s.name })));
    }
  }, [attributeValuesData]);

  // console.log(someSaleType,'someSaleType')

  useEffect(() => {
    // Check if the selected sale type name contains "Central" to determine if it's a central sale
    const iscentral = selectedSaleType?.label?.toLowerCase().includes("i/gst") || false;
    setIsCentralSale(iscentral);
  }, [selectedSaleType]);



  const handleItemChange = async (index, field, value) => {
    // Handle item selection by itemId (dropdown change)
    if (field === 'itemId') {
      try {

        const getItemList = await ItemServices.getItemById(value.value);
        const getIndividualDiscount = await ItemDiscountServices.getItemDiscountServices({ "PartyCode": getParty, "ItemCode": getItemList.item_code });
        const itemDiscount = getIndividualDiscount.data.Discount1;
        // console.log(getItemList,'getItemListgetItemListgetItemListgetItemList')


        setItems(prev => {
          const newItems = [...prev];
          const listPrice = parseFloat(getItemList.sale_price || '0');
          const quantity = 6; // Default quantity as per your requirement
          // Use vendorDiscount if set, otherwise use item discount
          const discount = itemDiscount !== 0 ? itemDiscount : (getItemList.discount !== undefined ? parseFloat(getItemList.discount) : 0);
          const totalDiscount = quantity * (listPrice * discount) / 100;
          const price = listPrice - (listPrice * discount) / 100;
          const amount = quantity * price;
          // Extract variants color and size
          const variants = getItemList.item_attribute?.variant || [];
          const vColors = [...new Set(variants.map(v => v.color).filter(Boolean))].map(c => {
            const global = colorOptions.find(opt => opt.label === c);
            return global || { value: c, label: c };
          });
          const vSizes = [...new Set(variants.map(v => v.size).filter(Boolean))].map(s => {
            const global = sizeOptions.find(opt => opt.label === s);
            return global || { value: s, label: s };
          });

          newItems[index] = {
            ...newItems[index],
            itemId: value, // set itemId
            name: getItemList.name, // keep name for display if needed
            hsn: getItemList.hsn_code || '',
            image: getItemList.image, // Add image to item data
            listPrice: listPrice.toFixed(2),
            quantity: quantity.toString(),
            discount: itemDiscount,
            totalDiscount: totalDiscount.toFixed(2),
            price: price.toFixed(2),
            amount: amount.toFixed(2),
            conversion_factor: getItemList.conversion_factor,
            description: getItemList.description,
            unit: getItemList?.unit_id ? { value: getItemList.unit_id, label: unitData?.find(u => u._id === getItemList.unit_id)?.name || 'Unknown' } : null,
            variantColors: vColors,
            variantSizes: vSizes
          };
          return newItems;
        });
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
      return; // Exit early after handling 'itemId'
    }

    setItems(prev => {
      const newItems = [...prev];
      let item = { ...newItems[index], [field]: value };
      let listPrice = parseFloat(item.listPrice || 0);
      let quantity = parseFloat(field === 'quantity' ? value : item.quantity || 0);
      let discount = parseFloat(field === 'discount' ? value : item.discount || 0);
      if (field === 'listPrice') listPrice = parseFloat(value || 0);
      // If discount is blank, null, or not a number, treat as 0
      if (field === 'discount' && (value === '' || value === null || isNaN(discount))) {
        discount = 0;
      }
      if (field === 'discount' || field === 'quantity' || field === 'listPrice') {
        // Calculate as per formula
        const totalDiscount = quantity * (listPrice * discount) / 100;
        // If discount is blank, price should be listPrice
        const price = (field === 'discount' && (value === '' || value === null || isNaN(parseFloat(value))))
          ? listPrice
          : listPrice - (listPrice * discount) / 100;
        const amount = quantity * price;
        item = {
          ...item,
          listPrice: listPrice.toFixed(2),
          quantity: quantity.toString(),
          discount: discount.toString(),
          totalDiscount: totalDiscount.toFixed(2),
          price: price.toFixed(2),
          amount: amount.toFixed(2)
        };
      }
      newItems[index] = item;
      return newItems;
    });
  };

  typeof window !== 'undefined' && window.console && console.log('SaleOrderDrawer mounted with id:', id);
  const [loading, setLoading] = useState(false);

  // Reset form when opening for new sale order
  // useEffect(() => {
  //   if (!id && isDrawerOpen) {
  //     resetForm();
  //   }
  // }, [id, isDrawerOpen]);

  // Reset form when drawer closes
  useEffect(() => {
    console.log("isDrawerOpen", isDrawerOpen);
    if (!isDrawerOpen) {
      // Reset form when drawer closes to ensure clean state for next open
      resetForm();
      console.log("Form resetting");
    }
  }, [isDrawerOpen]);

  // Fetch sale order details if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      SaleOrderServices.getSaleOrderById(id)
        .then((data) => {


          // setDate(data.date || new Date().toISOString().split('T')[0]);
          setDate(data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
          setVoucherNo(data.voucherNo || '');
          setMatCentre(data.matCentre || 'RETAIL');
          // Fix: Properly format customer value for SearchableDropdown
          // Use populated customer data from API response directly
          if (data.customer) {
            if (typeof data.customer === 'object' && data.customer._id) {
              // Customer is already populated with full details from API
              setSelectedCustomer({
                value: data.customer._id,
                label: data.customer.name
              });
              // Set party code for discount calculations
              if (data.customer.code) {
                setParty(data.customer.code);
                setPartyObject(data.customer);
                // Fetch vendor discount for the loaded customer
                getSundryDiscountsByPartyGroup({ getParty: data.customer.code });
              } else if (customerData && customerData.length > 0) {
                // Fallback: try to get code from customerData if not in populated data
                const customerOption = customerData.find(item => item._id === data.customer._id);
                if (customerOption && customerOption.code) {
                  setParty(customerOption.code);
                  setPartyObject(customerOption);
                  getSundryDiscountsByPartyGroup({ getParty: customerOption.code });
                }
              }
            } else if (customerData && customerData.length > 0) {
              // Fallback: customer is just an ID, find in customerData
              const customerId = data.customer;
              const customerOption = customerData.find(item => item._id === customerId);
              if (customerOption) {
                setSelectedCustomer({
                  value: customerOption._id,
                  label: customerOption.name
                });
                if (customerOption.code) {
                  setParty(customerOption.code);
                  setPartyObject(customerOption);
                  getSundryDiscountsByPartyGroup({ getParty: customerOption.code });
                }
              }
            }
          } else {
            setSelectedCustomer(null);
          }

          // Fix: Properly format salesman value for SearchableDropdown
          if (data.salesman && salesmanData && salesmanData.length > 0) {
            const salesmanId = typeof data.salesman === 'object' ? data.salesman._id : data.salesman;
            const salesmanOption = salesmanData.find(item => item._id === salesmanId);
            if (salesmanOption) {
              setSelectedSalesman({
                value: salesmanOption._id,
                label: salesmanOption.name
              });
            } else {
              setSelectedSalesman(null);
            }
          } else {
            setSelectedSalesman(null);
          }

          // Fix: Properly format sale type value for SearchableDropdown
          if (data.saleType && someSaleType && someSaleType.length > 0) {
            const saleTypeId = typeof data.saleType === 'object' ? data.saleType._id : data.saleType;
            const saleTypeOption = someSaleType.find(item => item._id === saleTypeId);
            if (saleTypeOption) {
              setSelectedSaleType({
                value: saleTypeOption._id,
                label: saleTypeOption.name
              });
            } else {
              setSelectedSaleType(null);
            }
          } else {
            setSelectedSaleType(null);
          }

          // Format items to ensure proper structure - Fixed this section
          if (data.items && data.items.length > 0) {
            const formattedItems = data?.items.map(item => {
              // Handle itemId properly for SearchableDropdown
              let formattedItemId = null;
              if (item.itemId) {
                if (typeof item.itemId === 'object') {
                  // If itemId is already an object with item details
                  formattedItemId = {
                    value: item.itemId._id,
                    label: item.itemId.name
                  };
                } else {
                  // If itemId is just a string ID, find the item in activeItems
                  const itemOption = activeItems?.find(activeItem => activeItem._id === item.itemId);
                  if (itemOption) {
                    formattedItemId = {
                      value: itemOption._id,
                      label: itemOption.name
                    };
                  }
                }
              }

              // Handle unit properly for SearchableDropdown
              let formattedUnit = null;

              // First, try to get unit from item.unit
              let unitId = null;
              let unitName = null;

              if (item.unit) {
                if (typeof item.unit === 'object' && item.unit !== null) {
                  // If unit is already an object with value/label
                  if (item.unit.value && item.unit.label) {
                    formattedUnit = item.unit;
                  } else if (item.unit._id) {
                    unitId = item.unit._id;
                  }
                } else if (typeof item.unit === 'string') {
                  // If unit is a string, it could be ID or name
                  unitName = item.unit;
                }
              }

              // If unit not found, check itemId.unit_id (from populated data)
              if (!formattedUnit && !unitId && !unitName) {
                if (item.itemId && typeof item.itemId === 'object' && item.itemId.unit_id) {
                  unitId = item.itemId.unit_id;
                }
              }

              // Find the unit in unitData if we have unitId or unitName
              if (!formattedUnit && unitData && Array.isArray(unitData) && unitData.length > 0) {
                let unitOption = null;

                if (unitId) {
                  // Find by ID (handle both string and ObjectId comparison)
                  unitOption = unitData.find(u => {
                    const uId = String(u._id || '');
                    const searchId = String(unitId || '');
                    return uId === searchId;
                  });
                } else if (unitName) {
                  // Find by name
                  unitOption = unitData.find(u => {
                    const uName = String(u.name || '').toLowerCase();
                    const searchName = String(unitName || '').toLowerCase();
                    return uName === searchName;
                  });
                }

                if (unitOption) {
                  formattedUnit = {
                    value: unitOption._id,
                    label: unitOption.name
                  };
                }
              }
              // // Extract image from populated item data
              // let itemImage = '';
              // if (typeof item.itemId === 'object' && item.itemId) {
              //   // Get image from populated item data
              //   if (item.itemId.image && item.itemId.image.length > 0 && item.itemId.image[0].url) {
              //     itemImage = item.itemId.image[0].url;
              //   } else if (item.itemId.default_image) {
              //     itemImage = item.itemId.default_image;
              //   }
              // } else if (item.image) {
              //   // Use existing image if available
              //   itemImage = item.image;
              // }

              // Extract variants color and size from populated itemId
              const variants = item.itemId?.item_attribute?.variant || [];
              const vColors = [...new Set(variants.map(v => v.color).filter(Boolean))].map(c => {
                const global = colorOptions.find(opt => opt.label === c);
                return global || { value: c, label: c };
              });
              const vSizes = [...new Set(variants.map(v => v.size).filter(Boolean))].map(s => {
                const global = sizeOptions.find(opt => opt.label === s);
                return global || { value: s, label: s };
              });

              return {
                image: item.image,
                name: typeof item.itemId === 'object' ? item.itemId?.name : (item?.name || ''),
                itemId: formattedItemId,
                hsn: typeof item.itemId === 'object' ? item.itemId?.hsn_code : (item.hsn || ''),
                quantity: item.quantity || '0',
                unit: formattedUnit,
                listPrice: item.listPrice || '0',
                discount: item.discount || '0',
                totalDiscount: item.totalDiscount || '0',
                price: item.price || '0',
                amount: item.amount || '0',
                color: item.color || '',
                size: item.size || '',
                conversion_factor: item.conversion_factor || 1,
                description: item.description,
                variantColors: vColors,
                variantSizes: vSizes
              };
            });
            setItems(formattedItems);
          }

          if (data.sundries) {
            // Handle new sundries format with SundriesDetail array
            if (data.sundries.SundriesDetail && Array.isArray(data.sundries.SundriesDetail)) {
              const hamali = data.sundries.SundriesDetail.find(item => item.Name === "Hammali@15/CRT" || item.Name === "Hamali");
              const cgst = data.sundries.SundriesDetail.find(item => item.Name === "CGST" || item.Name === "cgst");
              const sgst = data.sundries.SundriesDetail.find(item => item.Name === "SGST1" || item.Name === "SGST" || item.Name === "sgst");
              const discount = data.sundries.SundriesDetail.find(item => item.Name === "DISCOUNT" || item.Name === "discount");

              setTotalHammli(hamali?.DiscountAmount || 0);
              setTotalCgstSundries(cgst?.DiscountAmount || 0);
              setTotalSgstSundries(sgst?.DiscountAmount || 0);
              setTotalDiscountSundries(discount?.DiscountAmount || 0);
              setVendorDiscount(discount?.DiscountPercent || 0);
              setTotalIgstSundries((cgst?.DiscountAmount || 0) + (sgst?.DiscountAmount || 0));
            } else {
              // Handle old sundries format for backward compatibility
              setTotalHammli(data.sundries.hammali || 0);
              setVendorDiscount(data.sundries.discount || 0);
              setTotalCgstSundries(data.sundries.cgst || 0);
              setTotalSgstSundries(data.sundries.sgst || 0);
              setTotalIgstSundries(data.sundries.cgst + data.sundries.sgst || 0);
              setTotalDiscountSundries(data.sundries.discount || 0);
            }
          }
          setTotalAmount(data.totalAmount || 0);
          setTotalDiscountAmount(data.totalDiscountAmount || 0);
          setTotalQuantity(data.totalQuantity || 0);
          setNetAmount(data.netAmount || 0);
        })
        .catch((error) => {
          console.error("Error fetching sale order:", error);
          notifyError("Failed to load sale order data");
        })
        .finally(() => setLoading(false));
    }
  }, [id, customerData, salesmanData, someSaleType, activeItems, unitData]);

  // Update unit labels when unitData loads (for items that might have been loaded before unitData)
  useEffect(() => {
    if (unitData && Array.isArray(unitData) && unitData.length > 0 && items.length > 0) {
      setItems(prev => {
        let hasChanges = false;
        const updatedItems = prev.map(item => {
          // Skip if unit is already properly formatted
          if (item.unit && typeof item.unit === 'object' && item.unit.value && item.unit.label) {
            // Verify the label is correct
            const unitOption = unitData.find(u => {
              const uId = String(u._id || '');
              const itemUnitId = String(item.unit.value || '');
              return uId === itemUnitId;
            });
            if (unitOption && item.unit.label !== unitOption.name) {
              hasChanges = true;
              return {
                ...item,
                unit: {
                  value: unitOption._id,
                  label: unitOption.name
                }
              };
            }
            return item;
          }

          // Try to find unit from item.unit (string) or item.itemId.unit_id
          let unitId = null;
          if (item.unit && typeof item.unit === 'string') {
            // Try to find by name first, then by ID
            const byName = unitData.find(u => String(u.name || '').toLowerCase() === String(item.unit || '').toLowerCase());
            if (byName) {
              hasChanges = true;
              return {
                ...item,
                unit: {
                  value: byName._id,
                  label: byName.name
                }
              };
            }
            // Try as ID
            unitId = item.unit;
          } else if (!item.unit) {
            // Check if we can get unit from itemId (this shouldn't happen after initial load, but just in case)
            // This is handled in the initial load, so we can skip here
            return item;
          }

          if (unitId) {
            const unitOption = unitData.find(u => {
              const uId = String(u._id || '');
              const searchId = String(unitId || '');
              return uId === searchId;
            });
            if (unitOption) {
              hasChanges = true;
              return {
                ...item,
                unit: {
                  value: unitOption._id,
                  label: unitOption.name
                }
              };
            }
          }

          return item;
        });
        return hasChanges ? updatedItems : prev;
      });
    }
  }, [unitData]);

  // Update color and size objects when options load
  useEffect(() => {
    if (colorOptions.length > 0 || sizeOptions.length > 0) {
      setItems(prev => {
        let hasChanges = false;
        const updatedItems = prev.map(item => {
          let newItem = { ...item };
          let changed = false;

          // If variants are not extracted yet but we have item_attribute
          if (item.itemId?.item_attribute?.variant && (!item.variantColors?.length || !item.variantSizes?.length)) {
            const variants = item.itemId.item_attribute.variant;
            const uniqueColors = [...new Set(variants.map(v => v.color).filter(Boolean))];
            const uniqueSizes = [...new Set(variants.map(v => v.size).filter(Boolean))];

            newItem.variantColors = uniqueColors.map(c => colorOptions.find(opt => opt.label === c) || { value: c, label: c });
            newItem.variantSizes = uniqueSizes.map(s => sizeOptions.find(opt => opt.label === s) || { value: s, label: s });
            changed = true;
          }

          if (item.color && typeof item.color === 'string') {
            const foundColor = (newItem.variantColors?.length > 0 ? newItem.variantColors : colorOptions).find(c => c.label === item.color);
            if (foundColor) {
              newItem.color = foundColor;
              changed = true;
            }
          }

          if (item.size && typeof item.size === 'string') {
            const foundSize = (newItem.variantSizes?.length > 0 ? newItem.variantSizes : sizeOptions).find(s => s.label === item.size);
            if (foundSize) {
              newItem.size = foundSize;
              changed = true;
            }
          }

          if (changed) hasChanges = true;
          return changed ? newItem : item;
        });
        return hasChanges ? updatedItems : prev;
      });
    }
  }, [colorOptions, sizeOptions, items.length]); // items.length added to trigger when rows are added/loaded

  // Auto-calculate amounts when items change
  useEffect(() => {
    setItems(prev => {
      return prev.map(item => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseFloat(item.quantity) || 0;
        const amount = (price * quantity).toFixed(2);
        return {
          ...item,
          amount: amount
        };
      });
    });
  }, []);

  // Calculate total amount, total discount, and total quantity whenever items or vendor discount changes
  useEffect(() => {
    // Calculate basic totals from items
    const itemsTotal = items.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);

    const totalDiscount = items.reduce((sum, item) => {
      return sum + (parseFloat(item.totalDiscount) || 0);
    }, 0);
    setTotalDiscountAmount(Number(totalDiscount.toFixed(2)));

    const totalQty = items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) || 0);
    }, 0);
    setTotalQuantity(Number(totalQty.toFixed(2)));

    // Calculate hammali (conversion factor based)
    const hammaliAmount = items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      return sum + ((quantity * Number(item.conversion_factor)) * Number(hammaliDiscount.discount) || 0);
    }, 0);
    setTotalHammli(Number(hammaliAmount.toFixed(2)));

    // Step 1: Items total + Hammali = Subtotal
    const subtotalWithHammali = itemsTotal + hammaliAmount;
    setTotalAmount(Number(subtotalWithHammali.toFixed(2)));

    // Step 2: Apply vendor discount on subtotal
    const vendorDiscountAmount = (subtotalWithHammali * (vendorDiscount || 0)) / 100;
    setTotalDiscountSundries(Number(vendorDiscountAmount.toFixed(2)));

    // Step 3: Subtotal after vendor discount
    const subtotalAfterDiscount = subtotalWithHammali - vendorDiscountAmount;

    // Step 4: Calculate GST on discounted amount
    const cgstAmount = (subtotalAfterDiscount * 2.5) / 100; // 6% CGST
    const sgstAmount = (subtotalAfterDiscount * 2.5) / 100; // 6% SGST
    setTotalCgstSundries(Number(cgstAmount.toFixed(2)));
    setTotalSgstSundries(Number(sgstAmount.toFixed(2)));
    setTotalIgstSundries(Number((cgstAmount + sgstAmount).toFixed(2)));

    // Step 5: Final net amount = Subtotal after discount + GST
    const finalNetAmount = subtotalAfterDiscount + cgstAmount + sgstAmount;
    setNetAmount(Number(finalNetAmount.toFixed(2)));


  }, [items, vendorDiscount]);

  const handleAddItem = () => {
    setItems(prev => [...prev, {
      image: '',
      name: '',
      itemId: '',
      hsn: '',
      quantity: '0',
      unit: null,
      listPrice: '0',
      discount: '0',
      totalDiscount: '0',
      price: '0',
      amount: '0.00',
      color: '',
      size: ''
    }]);
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // const calculateTotal = (sundries) => {
  //   let total = 0;
  //   [...sundries.left, ...sundries.right].forEach(item => {
  //     const amount = parseFloat(item.amount1) || 0;
  //     total += item.type === '+' ? amount : -amount;
  //   });
  //   return total.toFixed(2);
  // };



  const resetForm = () => {
    setItems([{
      image: '',
      name: '',
      itemId: '',
      hsn: '',
      quantity: '',
      unit: null,
      listPrice: '',
      discount: '',
      totalDiscount: '',
      price: '',
      amount: '',
      color: '',
      size: '',
      variantColors: [],
      variantSizes: []
    }]);

    setTotalAmount(0);
    setTotalDiscountAmount(0);
    setTotalQuantity(0);
    setTotalHammli(0);
    setTotalCgstSundries(0);
    setTotalSgstSundries(0);
    setTotalDiscountSundries(0);
    setNetAmount(0);
    setDate(new Date().toISOString().split('T')[0]);
    setVoucherNo('');
    setMatCentre('RETAIL');
    setSelectedCustomer(null);
    setSelectedSalesman(null);
    setSelectedSaleType(null);
    setParty(null);
    setVendorDiscount(0);
    setItemDiscount(0);
    setSelectedItem(null);
    setItemCode(null);
  };

  // Auto-select salesman if logged in user is a salesman
  useEffect(() => {
    if (!id && isDrawerOpen && adminInfo?.salesman_id && salesmanData && !selectedSalesman) {
      const salesmanOption = salesmanData.find(s => s._id === adminInfo.salesman_id);
      if (salesmanOption) {
        setSelectedSalesman({
          value: salesmanOption._id,
          label: salesmanOption.name
        });
      }
    }
  }, [id, isDrawerOpen, adminInfo, salesmanData, selectedSalesman]);

  // useEffect(() => {
  //   if (isCentralSale) {
  //     setCustomerType("Inter-State");
  //   } else {
  //     setCustomerType("Intra-State");
  //   }
  // }, [isCentralSale]);

  const saveSaleOrder = async () => {
    try {
      // Validate required fields
      if (!selectedSaleType?.value) {
        notifyError('Please select a Sale Type');
        return;
      }
      if (!selectedCustomer?.value) {
        notifyError('Please select a Customer');
        return;
      }
      if (!selectedSalesman?.value) {
        notifyError('Please select a Salesman');
        return;
      }
      if (items.length === 0 || !items[0].itemId?.value) {
        notifyError('Please add at least one item');
        return;
      }

      let sundriesArray = [];
      if (selectedSaleType?.label.toLowerCase().includes('i/gst')) {
        sundriesArray.push({
          Name: "IGST",
          DiscountAmount: (Number(totalCgstSundries) + Number(totalSgstSundries)).toFixed(3),
          DiscountPercent: 5
        });
      } else if (selectedSaleType?.label.toLowerCase().includes('l/gst')) {
        sundriesArray.push(
          { Name: "CGST", DiscountAmount: totalCgstSundries, DiscountPercent: 2.5 },
          { Name: "SGST", DiscountAmount: totalSgstSundries, DiscountPercent: 2.5 }
        );
      }

      console.log("Sundries Array: ", items);
      const saleOrderData = {
        date,
        saleType: selectedSaleType?.value || '',
        matCentre: "Selection Footwear",
        customer: selectedCustomer?.value || '',
        salesman: selectedSalesman?.value || '',
        items: items.map((item) => ({
          ...item,
          itemId: item.itemId?.value,
          unit: item.unit?.value,
          color: item.color?.label || item.color || '',
          size: item.size?.label || item.size || '',
        })),
        sundries: {
          SundriesDetail: [
            {
              Name: hammaliDiscount.name,
              DiscountAmount: totalHammli,
              DiscountPercent: hammaliDiscount.discount
            },
            {
              Name: "Discount",
              DiscountAmount: totalDiscountSundries,
              DiscountPercent: vendorDiscount
            },
            ...sundriesArray
          ]
        },
        totalAmount,
        totalDiscountAmount,
        totalQuantity,
        netAmount: totalNetAmount,
      };

      await onSubmit(saleOrderData);
    } catch (error) {
      console.error("Error saving sale order:", error);
      // Handle error appropriately, e.g., show a notification

    }
  };

  const getItemDiscount = async (ItemCode, PartyCode) => {
    try {
      const response = await ItemServices.getItemDiscount({ ItemCode, PartyCode });
      console.log("Item Discount: ", response.Discount1);
      setItemDiscount(response.Discount1);
    } catch (error) {
      console.error("Error fetching item discount:", error);
      return 0;
    }
  };

  const getSundryDiscountsByPartyGroup = async (partyCode) => {
    try {
      const { sundryDiscounts, hammali } = await SundryDiscountService.getSundryDiscountsByPartyGroup(partyCode);
      if (Array.isArray(sundryDiscounts) && sundryDiscounts.length > 0 && sundryDiscounts[0].discount) {
        setVendorDiscount(sundryDiscounts[0].discount);
        setHammaliDiscount(hammali);
      } else {
        setVendorDiscount(0);
      }
    } catch (error) {
      setVendorDiscount(0);
    }
  };

  const recalculateItemDiscountsForNewParty = async (newPartyCode) => {
    try {
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          if (item.itemId?.value && item.name) {
            try {
              // Get item details first to ensure we have the latest data
              const getItemList = await ItemServices.getItemById(item.itemId.value);

              // Get individual discount for the new party
              const getIndividualDiscount = await ItemDiscountServices.getItemDiscountServices({
                "PartyCode": newPartyCode,
                "ItemCode": getItemList.item_code
              });

              const itemDiscount = getIndividualDiscount.data.Discount1;
              const listPrice = parseFloat(getItemList.sale_price || '0');
              const quantity = parseFloat(item.quantity || '0');

              // Use vendor discount if item discount is 0, otherwise use item discount
              const discount = itemDiscount !== 0 ? itemDiscount : (getItemList.discount !== undefined ? parseFloat(getItemList.discount) : 0);
              const totalDiscount = quantity * (listPrice * discount) / 100;
              const price = listPrice - (listPrice * discount) / 100;
              const amount = quantity * price;

              return {
                ...item,
                listPrice: listPrice.toFixed(2),
                discount: itemDiscount,
                totalDiscount: totalDiscount.toFixed(2),
                price: price.toFixed(2),
                amount: amount.toFixed(2),
              };
            } catch (error) {
              console.error('Error recalculating discount for item:', item.name, error);
              // Return the original item if there's an error
              return item;
            }
          }
          return item;
        })
      );

      setItems(updatedItems);
      console.log('Item discounts recalculated for new party:', newPartyCode);
    } catch (error) {
      console.error('Error recalculating item discounts:', error);
    }
  };
  const getItemCode = async (id) => {
    try {
      const response = await ItemServices.getItemCode(id);
      setItemCode(response.item_code);
    } catch (error) {
      console.error("Error fetching item code:", error);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      getItemCode(selectedItem);
    }
  }, [selectedItem, itemCode])

  useEffect(() => {
    if (itemCode && getParty) {
      getItemDiscount(itemCode, getParty);
    }
  }, [selectedItem, getParty])

  // useEffect(() => {
  //   if (getParty) {
  //     getSundryDiscountsByPartyGroup({ "getPartyObject": getPartyObject?.vendor_group_id?.busy_group_id, "getParty": getParty });
  //   }
  // }, [getParty])

  useEffect(() => {
    if (someSaleType && someSaleType.length > 0 && !selectedSaleType) {
      const targetSaleType = someSaleType[1] || someSaleType[0];
      if (targetSaleType) {
        const defaultOption = { value: targetSaleType._id, label: targetSaleType.name };
        setSelectedSaleType(defaultOption);
      }
    }
  }, [someSaleType]);

  return (
    <>
      <div className="w-full relative p-4 sm:p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          register={register}
          handleSelectLanguage={handleSelectLanguage}
          title={id ? (isViewOnly ? t("View Sale Order") : t("Update Sale Order")) : t("Add Sale Order")}
        />
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody className={isViewOnly ? "pointer-events-none opacity-80" : ""}>
            {/* Responsive grid for form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4">

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Date
                </label>
                <InputArea
                  name="date"
                  type="date"
                  disabled={isViewOnly}
                  register={register}
                  placeholder="Select date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                />
              </div>

              {
                id ? <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Voucher No
                  </label>
                  <InputArea
                    name="voucherNo"
                    type="text"
                    disabled={isViewOnly}
                    register={register}
                    placeholder="Voucher Number"
                    value={voucherNo}
                    onChange={(e) => setVoucherNo(e.target.value)}
                    className="w-full"
                  />
                </div> : ""
              }
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Sale Type
                </label>
                <SearchableDropdown
                  options={someSaleType.map((item) => ({ "value": item._id, "label": item.name }))}
                  onChange={(value) => {
                    setSelectedSaleType(value);
                  }}
                  disabled={isViewOnly}
                  value={
                    selectedSaleType?.value && someSaleType?.find((item) => item._id === selectedSaleType.value)
                      ? {
                        value: selectedSaleType.value,
                        label: someSaleType?.find((item) => item._id === selectedSaleType.value).name,
                      }
                      : selectedSaleType
                  }
                  placeholder={"Search SaleType"}
                  className="w-full"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Party Name
                </label>
                <SearchableDropdown
                  options={customerOptions}
                  onSearch={handleSearchCustomers}
                  onLoadMore={handleLoadMoreCustomers}
                  hasMore={hasMoreCustomers}
                  loading={isSearchingCustomers}
                  loadingMore={loadingMoreCustomers}
                  onChange={(value) => {
                    const selected = customerList.find((cust) => cust._id === value?.value);
                    setSelectedCustomer(value);
                    if (selected?.code) {
                      const oldParty = getParty;
                      setParty(selected.code);
                      setPartyObject(selected)

                      console.log(selected, 'selected?.vendor_group_id?.busy_group_id');

                      getSundryDiscountsByPartyGroup({ party_group_code: selected?.vendor_group_id?.busy_group_id, getParty: selected.code });

                      if (oldParty !== selected.code && items.length > 0 && items[0].itemId?.value) {
                        recalculateItemDiscountsForNewParty(selected.code);
                      }
                    }
                  }}
                  disabled={isViewOnly}
                  value={selectedCustomer}
                  placeholder={"Search party"}
                  className="w-full"
                />
              </div>
              {/* <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Material Centre
                </label>
                <InputArea
                  disabled={isViewOnly}
                  name="matCentre"
                  register={register}
                  placeholder="Select material centre"
                  className="w-full"
                  value={matCentre}
                  onChange={(e) => setMatCentre(e.target.value)}
                />
              </div> */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Salesman
                </label>
                <SearchableDropdown
                  options={salesmanData.map((item) => ({ "value": item._id, "label": item.name }))}
                  onChange={(value) => setSelectedSalesman(value)}
                  disabled={isViewOnly}
                  placeholder={"Search Salesman"}
                  value={selectedSalesman}
                  className="w-full"
                />
              </div>
            </div>

            {/* Responsive Grid wrapper */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-md p-4 shadow-sm bg-white relative"
                >
                  <div className="absolute top-[6px] right-[8px]">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      title="Remove Item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <label className="text-xs font-semibold">Image</label>
                      <div className="w-12 h-12 border-2 border-gray-300 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200">
                        {item.image ? (
                          <img
                            src={`${import.meta.env.VITE_APP_API_SOCKET_URL}${item.image}`}
                            alt="Item"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="text-gray-400 text-xs font-medium" style={{ display: item.image ? 'none' : 'flex', textAlign: 'center', padding: '4px' }}>
                          No Image
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold">Item</label>
                      <ItemSearchableDropdown
                        options={activeItems?.map((ai) => ({
                          value: ai._id,
                          label: [
                            ai.name,
                            // ai?.category_id?.name || "",
                            // ai?.item_group_id?.name || "",
                            // ai?.brand_id?.name || ""
                          ].filter(Boolean).join(" | "),
                          image: ai.image && ai.image.length > 0 ? `${import.meta.env.VITE_APP_API_SOCKET_URL}${ai.image[0]}` : "",
                          stock: ai.stock
                        })) || []}
                        onChange={(value) => {
                          console.log(value, 'imagesesjlkjlkjlkjlkjlkjlkj')
                          setSelectedItem(value?.value);
                          handleItemChange(index, 'itemId', value)
                        }}
                        disabled={isViewOnly}
                        placeholder="Search Item"
                        value={item.itemId}
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="text-xs font-semibold">HSN Code</label>
                      <Input
                        disabled={isViewOnly}
                        type="text"
                        value={item.hsn || ''}
                        onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                        placeholder="HSN Code"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs font-semibold">Color</label>
                      <SearchableDropdown
                        disabled={isViewOnly}
                        options={item.variantColors?.length > 0 ? item.variantColors : colorOptions}
                        value={typeof item.color === 'string' ? (item.variantColors?.find(c => c.label === item.color) || colorOptions.find(c => c.label === item.color)) : item.color}
                        onChange={(value) => handleItemChange(index, 'color', value)}
                        placeholder="Color"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs font-semibold">Size</label>
                      <SearchableDropdown
                        disabled={isViewOnly}
                        options={item.variantSizes?.length > 0 ? item.variantSizes : sizeOptions}
                        value={typeof item.size === 'string' ? (item.variantSizes?.find(s => s.label === item.size) || sizeOptions.find(s => s.label === item.size)) : item.size}
                        onChange={(value) => handleItemChange(index, 'size', value)}
                        placeholder="Size"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs font-semibold">Qty</label>
                      <Input
                        disabled={isViewOnly}
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        placeholder="Qty"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="text-xs font-semibold">Unit</label>
                      <SearchableDropdown
                        disabled={isViewOnly}
                        value={item.unit}
                        onChange={(value) => handleItemChange(index, 'unit', value)}
                        placeholder="Unit"
                        options={unitData?.map((unit) => ({
                          value: unit._id,
                          label: unit.name
                        }))
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs font-semibold">List Price</label>
                      <Input
                        disabled={isViewOnly}
                        type="number"
                        value={item.listPrice || ''}
                        onChange={(e) => handleItemChange(index, 'listPrice', e.target.value)}
                        placeholder="List Price"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs font-semibold">Disc. %</label>
                      <Input
                        disabled={isViewOnly}
                        type="number"
                        value={item.discount || '0.00'}
                        onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                        placeholder="Disc %"
                        step="0.01"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs font-semibold">Total Disc.</label>
                      <Input
                        disabled={isViewOnly}
                        type="number"
                        value={item.totalDiscount || '0.00'}
                        onChange={(e) => handleItemChange(index, 'totalDiscount', e.target.value)}
                        placeholder="Total Disc."
                        step="0.01"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs font-semibold">Price</label>
                      <Input
                        disabled={isViewOnly}
                        type="number"
                        value={item.price || ''}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        placeholder="Price"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs font-semibold">Amount</label>
                      <Input
                        disabled={isViewOnly}
                        type="number"
                        value={item.amount || ''}
                        readOnly
                        className="bg-gray-100"
                        placeholder="Amount"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs font-semibold">Description</label>
                      <Input
                        // disabled={isViewOnly}
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  onClick={handleAddItem}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded text-sm"
                >
                  + Add Item
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-md font-semibold text-sm">
                <div>Total Quantity: <span className="font-bold">{totalQuantity}</span></div>
                <div>Total Discount Amount: <span className="font-bold">₹{!totalDiscountAmount ? "0.00" : totalDiscountAmount}</span></div>
                <div>Total Amount: <span className="font-bold text-lg">₹{totalAmount}</span></div>
              </div>
            </div>




            {/* Bill Sundry Details - Perfected for mobile */}
            <div className="bg-blue-50 dark:bg-gray-700 p-3 sm:p-4 rounded border text-gray-800 dark:text-gray-200 mt-4">
              <div className="text-base font-bold mb-3 tracking-wide">
                Bill Sundry Details <span className="text-xs italic font-normal">(Apply Tax - F4)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Left: Hammali */}
                <div className="rounded bg-white dark:bg-gray-800 p-3 flex flex-row sm:grid sm:grid-cols-6 gap-2 items-center shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="font-semibold col-span-1 w-full sm:w-auto">1. (+)</div>
                  <div className="font-semibold col-span-2 w-full sm:w-auto">{hammaliDiscount.name ?? "Hammali@20/CRT"}</div>
                  <div className="col-span-1 w-full sm:w-auto mt-2 sm:mt-0 flex sm:block">
                    <Input
                      disabled={isViewOnly}
                      type="number"
                      step="0.01"
                      value={hammaliDiscount.discount}
                      className="w-full text-right px-2 py-2"
                      readOnly
                    />
                  </div>
                  <div className="col-span-1 w-full sm:w-auto mt-2 sm:mt-0 flex sm:block ml-0">
                    <Input
                      disabled={isViewOnly}
                      type="number"
                      step="0.01"
                      value={totalHammli}
                      className="w-full text-right px-2 py-2"
                      readOnly
                    />
                  </div>
                </div>

                {/* Right: Discount */}
                <div className="rounded bg-white dark:bg-gray-800 p-3 flex flex-row sm:grid sm:grid-cols-6 gap-2 items-center shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="font-semibold col-span-1 w-full sm:w-auto">2. (-)</div>
                  <div className="font-semibold col-span-2 w-full sm:w-auto">Discount</div>
                  <div className="col-span-1 w-full sm:w-auto mt-2 sm:mt-0 flex sm:block">
                    <Input
                      disabled={isViewOnly}
                      type="number"
                      step="0.01"
                      value={vendorDiscount || '0.00'}
                      className="w-full text-right px-2 py-2"
                      readOnly
                    />
                  </div>
                  <div className="col-span-1 w-full sm:w-auto mt-2 sm:mt-0 flex sm:block ml-0">
                    <Input
                      disabled={isViewOnly}
                      type="number"
                      step="0.01"
                      value={totalDiscountSundries || '0.00'}
                      className="w-full text-right px-2 py-2"
                      readOnly
                    />
                  </div>
                </div>

                {/* Conditional: IGST OR CGST + SGST */}
                {isCentralSale ? (
                  <div className="sm:col-span-2">
                    <div className="rounded bg-white dark:bg-gray-800 p-3 flex flex-row sm:grid sm:grid-cols-6 gap-2 items-center shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="font-semibold col-span-1 w-full sm:w-auto">3. (+)</div>
                      <div className="font-semibold col-span-2 w-full sm:w-auto">IGST</div>
                      <div className="col-span-1 w-full sm:w-auto mt-2 sm:mt-0">
                        <Input
                          disabled={isViewOnly}
                          type="number"
                          step="0.01"
                          value="5.000"
                          className="w-full text-right px-2 py-2"
                          readOnly
                        />
                      </div>
                      <div className="col-span-1 w-full sm:w-auto mt-2 sm:mt-0 flex sm:block ml-0">
                        <Input
                          disabled={isViewOnly}
                          type="number"
                          step="0.01"
                          value={(Number(totalCgstSundries) + Number(totalSgstSundries)).toFixed(3)}
                          className="w-full text-right px-2 py-2"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* CGST */}
                    <div className="sm:col-span-1">
                      <div className="rounded bg-white dark:bg-gray-800 p-3 flex flex-row sm:grid sm:grid-cols-6 gap-2 items-center shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="font-semibold col-span-1 w-full sm:w-auto">3. (+)</div>
                        <div className="font-semibold col-span-2 w-full sm:w-auto">CGST</div>
                        <div className="col-span-1 w-full sm:w-auto mt-2 sm:mt-0">
                          <Input
                            disabled={isViewOnly}
                            type="number"
                            step="0.01"
                            value="2.5"
                            className="w-full text-right px-2 py-2"
                            readOnly
                          />
                        </div>
                        <div className="col-span-1 w-full sm:w-auto mt-2 sm:mt-0 flex sm:block ml-0">
                          <Input
                            disabled={isViewOnly}
                            type="number"
                            step="0.01"
                            value={totalCgstSundries.toFixed(2)}
                            className="w-full text-right px-2 py-2"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    {/* SGST */}
                    <div className="sm:col-span-1">
                      <div className="rounded bg-white dark:bg-gray-800 p-3 flex flex-row sm:grid sm:grid-cols-6 gap-2 items-center shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="font-semibold col-span-1 w-full sm:w-auto">4. (+)</div>
                        <div className="font-semibold col-span-2 w-full sm:w-auto">SGST</div>
                        <div className="col-span-1 w-full sm:w-auto mt-2 sm:mt-0">
                          <Input
                            disabled={isViewOnly}
                            type="number"
                            step="0.01"
                            value="2.5"
                            className="w-full text-right px-2 py-2"
                            readOnly
                          />
                        </div>
                        <div className="col-span-1 w-full sm:w-auto mt-2 sm:mt-0 flex sm:block ml-0">
                          <Input
                            disabled={isViewOnly}
                            type="number"
                            step="0.01"
                            value={totalSgstSundries.toFixed(2)}
                            className="w-full text-right px-2 py-2"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>


            {/* Tax Summary Section - Mobile Responsive */}
            <div className="bg-blue-50 dark:bg-gray-700 p-3 sm:p-4 mt-6 border-t border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded">
              {/* Tax Summary Table - Responsive */}
              <div className="overflow-x-auto">
                {/* Desktop Table */}
                <table className="min-w-full border-collapse w-full hidden sm:table">
                  <thead>
                    <tr className="bg-blue-100 dark:bg-gray-800">
                      <th className="px-2 py-2 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Tax Rate</th>
                      <th className="px-2 py-2 text-left font-semibold border-b border-gray-200 dark:border-gray-600">Taxable Amt.</th>
                      {isCentralSale ? (
                        <th className="px-2 py-2 text-left font-semibold border-b border-gray-200 dark:border-gray-600">IGST</th>
                      ) : (
                        <>
                          <th className="px-2 py-2 text-left font-semibold border-b border-gray-200 dark:border-gray-600">CGST</th>
                          <th className="px-2 py-2 text-left font-semibold border-b border-gray-200 dark:border-gray-600">SGST</th>
                        </>
                      )}
                      <th className="px-2 py-2 border-b border-gray-200 dark:border-gray-600"></th>
                      <th className="px-2 py-2 text-right font-semibold border-b border-gray-200 dark:border-gray-600">
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-2 py-2 border-b border-gray-200 dark:border-gray-600">5%</td>
                      <td className="px-2 py-2 border-b border-gray-200 dark:border-gray-600">₹{totalAmount.toFixed(2)}</td>
                      {isCentralSale ? (
                        <td className="px-2 py-2 border-b border-gray-200 dark:border-gray-600">₹{totalIgstSundries.toFixed(2)}</td>
                      ) : (
                        <>
                          <td className="px-2 py-2 border-b border-gray-200 dark:border-gray-600">₹{totalCgstSundries.toFixed(2)}</td>
                          <td className="px-2 py-2 border-b border-gray-200 dark:border-gray-600">₹{totalSgstSundries.toFixed(2)}</td>
                        </>
                      )}
                      <td className="px-2 py-2 border-b border-gray-200 dark:border-gray-600"></td>
                      <td className="px-2 py-2 text-right border-b border-gray-200 dark:border-gray-600"><strong>₹{totalNetAmount.toFixed(2)}</strong></td>
                    </tr>
                  </tbody>
                </table>

                {/* Mobile View: Card-based Layout */}
                <div className="sm:hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="bg-blue-100 dark:bg-gray-800 px-3 py-2 rounded-t-lg">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Tax Summary</h4>
                  </div>
                  <div className="p-3 space-y-3">
                    {/* Tax Rate and Taxable Amount */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tax Rate:</span>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Taxable Amount:</span>
                      <span className="text-sm font-medium">₹{totalAmount.toFixed(2)}</span>
                    </div>

                    {/* Tax Components */}
                    {isCentralSale ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">IGST (5%):</span>
                        <span className="text-sm font-medium">₹{totalIgstSundries.toFixed(2)}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">CGST (2.5%):</span>
                          <span className="text-sm font-medium">₹{totalCgstSundries.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">SGST (2.5%):</span>
                          <span className="text-sm font-medium">₹{totalSgstSundries.toFixed(2)}</span>
                        </div>
                      </>
                    )}

                    {/* Total Tax */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Total Tax:</span>
                        <span className="text-sm font-semibold">
                          ₹{(isCentralSale ? totalIgstSundries : totalCgstSundries + totalSgstSundries).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Net Amount */}
                    <div className="bg-blue-50 dark:bg-gray-700 px-3 py-2 rounded border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Total Amount:</span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">₹{totalNetAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Summary Checkbox */}
              <div className="flex items-center space-x-2 mb-4 mt-4 sm:mt-2">
                <input type="checkbox" id="taxSummary" defaultChecked className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
                <label htmlFor="taxSummary" className="text-sm select-none">Tax Summary</label>
              </div>

              {/* Button Group - Responsive */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 text-xs mt-2">
                <button
                  className="bg-green-100 border border-green-400 px-2 py-2 rounded shadow-sm hover:bg-green-200 w-full sm:w-auto transition"
                  onClick={saveSaleOrder}
                >
                  Save
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default SaleOrderDrawer;

