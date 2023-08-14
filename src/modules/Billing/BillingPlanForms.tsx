import {
  Grid,
  InputLabel,
  Box,
  TextField,
  OutlinedInput,
  FormHelperText,
  Alert,
  FormControl,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Radio,
  Card,
  Chip,
} from '@mui/material';

import { Field, FormikProps } from 'formik';
import React, { useCallback, ChangeEvent, FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { AddBillingPlanProps } from 'interfaces/billingPlan';
import DynamicSelectField from 'containers/setting/profile/DynamicSelectField';

import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import BadgeIcon from '@mui/icons-material/Badge';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TextEditor from 'components/MyTextEditor/MyEditor';
import type { Identifier, XYCoord } from 'dnd-core';
import update from 'immutability-helper';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
interface IProps {
  formikBag: FormikProps<AddBillingPlanProps>;
  isViewOnly: boolean;
  loading: boolean;
  featuresCheckbox?: any;
  setFeaturesCheckbox?: any;
  setItems?: any;
  items?: any;
}

export const BillingPlanStepOne: FC<IProps> = ({
  formikBag,
  isViewOnly,
  //   handleUploadImage,
  loading,
}) => {
  const { errors, values, touched, setFieldTouched, handleChange, handleBlur } = formikBag;

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const key = ev.target.name;
    handleChange(ev);
    setFieldTouched(key);
  };

  const handleSelectTouch = (key: string): void => {
    setFieldTouched(key);
  };

  //   useEffect(() => {
  //     if (countryOptions?.length === 0) fetchCountry();
  //     if (designationOptions?.length === 0) fetchDesignations();
  //   }, []);

  return (
    <Box
      className="setting-form-group"
      sx={{
        margin: '0px 20px 0px 25px',
      }}>
      <Grid container spacing={2} className="formGroupItem">
        <Grid item xs={3}>
          <InputLabel htmlFor="timeZone">
            <div className="label-heading">
              Plan Name <sup>*</sup>{' '}
            </div>
          </InputLabel>
        </Grid>
        <Grid item xs={5}>
          <FormControl fullWidth>
            <OutlinedInput
              type="text"
              id="outlined-adornment-amount"
              name="title"
              value={values.title}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={Boolean(touched.title && errors.title)}
              disabled={isViewOnly}
            />
            {Boolean(touched.title && errors.title) && (
              <FormHelperText error>{errors.title}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <InputLabel htmlFor="timeZone"></InputLabel>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <TextEditor
                name="description"
                reinitialize={values.title}
                initialContent={values?.description}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export const BillingPlanStepTwo: FC<IProps> = ({
  formikBag,
  isViewOnly,
  //   handleUploadImage,
  loading,
}) => {
  const [disablePaid, setDisablePaid] = useState<boolean>(false);
  const { errors, values, touched, setFieldTouched, handleChange, handleBlur } = formikBag;

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const key = ev.target.name;
    handleChange(ev);
    setFieldTouched(key);
  };

  const handleSelectTouch = (key: string): void => {
    setFieldTouched(key);
  };

  const paymentTermOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Half Yearly', value: 'halfYearly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  const accountType = [
    { label: 'Free', value: 'free' },
    { label: 'Paid', value: 'paid' },
  ];

  React.useEffect(() => {
    if (values.account_type === 'free') {
      setDisablePaid(true);
    } else {
      setDisablePaid(false);
    }
  }, [values.account_type]);

  return (
    <Box
      className="setting-form-group"
      sx={{
        margin: '0px 20px 0px 25px',
      }}>
      <Grid container spacing={4} className="formGroupItem">
        <Grid item xs={6}>
          <Grid item xs={4}>
            <InputLabel htmlFor="fullName">
              <div className="label-heading">
                Account Type <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <DynamicSelectField
              isViewOnly={isViewOnly}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSelectTouch={handleSelectTouch}
              id="account_type"
              menuOptions={accountType}
              value={values.account_type}
              error={errors.account_type}
              touched={touched.account_type}
            />
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Grid item xs={12}>
            <InputLabel htmlFor="timeZone">
              <div className="label-heading">
                Preferred Payment Term <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <DynamicSelectField
              isViewOnly={isViewOnly || disablePaid}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSelectTouch={handleSelectTouch}
              id="pricing_type"
              menuOptions={paymentTermOptions}
              value={values.pricing_type}
              error={errors.pricing_type}
              touched={touched.pricing_type}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Alert severity="info">
            {' '}
            <strong>Note :</strong> Changing prices related to sign ups will only affect new members
            sign ups, existing subscriptions will not be charged
          </Alert>
        </Grid>
        <Grid item xs={6}>
          <Grid item xs={12}>
            <InputLabel htmlFor="timeZone">
              <div className="label-heading">Monthly Price (billed every 30 days)</div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <OutlinedInput
                type="number"
                name="monthly_price"
                value={values.monthly_price}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={Boolean(touched.monthly_price && errors.monthly_price)}
                disabled={isViewOnly || disablePaid}
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
              />
              <FormHelperText id="billing-component-helper-text">
                Entering a value grater than $0 will enable this payment option
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item xs={12}>
            <InputLabel htmlFor="timeZone">
              <div className="label-heading">Quarterly Price (billed every 3 months)</div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <OutlinedInput
                type="number"
                name="quarterly_price"
                value={values.quarterly_price}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={Boolean(touched.quarterly_price && errors.quarterly_price)}
                disabled={isViewOnly || disablePaid}
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
              />
              <FormHelperText id="billing-component-helper-text">
                Entering a value grater than $0 will enable this payment option
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item xs={12}>
            <InputLabel htmlFor="timeZone">
              <div className="label-heading">Semi-Yearly Price (billed every 6 months)</div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <OutlinedInput
                type="number"
                name="semiyearly_price"
                value={values.semiyearly_price}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={Boolean(touched.semiyearly_price && errors.semiyearly_price)}
                disabled={isViewOnly || disablePaid}
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
              />
              <FormHelperText id="billing-component-helper-text">
                Entering a value grater than $0 will enable this payment option
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item xs={12}>
            <InputLabel htmlFor="timeZone">
              <div className="label-heading">Yearly Price (billed every 12 months)</div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <OutlinedInput
                type="number"
                name="yearly_price"
                value={values.yearly_price}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={Boolean(touched.yearly_price && errors.yearly_price)}
                disabled={isViewOnly || disablePaid}
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
              />
              <FormHelperText id="billing-component-helper-text">
                Entering a value grater than $0 will enable this payment option
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item xs={12}>
            <InputLabel htmlFor="timeZone">
              <div className="label-heading">One-time setup fee</div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <OutlinedInput
                type="number"
                name="setup_price"
                value={values.setup_price}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={Boolean(touched.setup_price && errors.setup_price)}
                disabled={isViewOnly || disablePaid}
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
              />
              <FormHelperText id="billing-component-helper-text">
                Additional one-time that can be applied during the sign up process
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

// acharayapuru05@gmail.com <acharayapuru05@gmail.com>; nebulaanish@gmail.com <nebulaanish@gmail.com>; mishranikesh317@gmail.com <mishranikesh317@gmail.com>; bhusalsanjeev23@gmail.com <bhusalsanjeev23@gmail.com>; brprabin811@gmail.com <brprabin811@gmail.com>; anoj1810@gmail.com <anoj1810@gmail.com>; arunkhanal2013@gmail.com <arunkhanal2013@gmail.com>; pasangtemba.sherpa5@gmail.com <pasangtemba.sherpa5@gmail.com>; sayhello@rijantiwari.com.np <sayhello@rijantiwari.com.np>; iamsaphal21@gmail.com <iamsaphal21@gmail.com>; isudip.th@gmail.com <isudip.th@gmail.com>; uks56shr567@gmail.com <uks56shr567@gmail.com>; sunilkc2055@gmail.com <sunilkc2055@gmail.com>; poudel.birat25@gmail.com <poudel.birat25@gmail.com>; paudelremant45@gmail.com <paudelremant45@gmail.com>

export const BillingPlanStepThree: FC<IProps> = ({
  formikBag,
  isViewOnly,
  setItems,
  items,

  loading,
}) => {
  const itemsRef = React.useRef(items);
  itemsRef.current = items;

  const { billingId } = useParams();

  //   const [optionItems, setOptionItems] = useState(OptionsItems);

  const { errors, values, touched, setFieldTouched, handleChange, handleBlur } = formikBag;

  React.useEffect(() => {
    let newData = { id: 0, content: values.title || '', checked: false, pre_selected: false };

    const filteredData = items.filter((item: any) => item.id === 0);
    if (filteredData.length < 1 && billingId === undefined) {
      setItems((prevCards: any) => [...prevCards, newData]);
    }

    // if (billingId === undefined) {
    //   setItems((prevCards: any) => [...prevCards, newData]);
    // }
    // setItems((prevCards: any) => [...prevCards, newData]);
  }, []);

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const key = ev.target.name;
    handleChange(ev);
    setFieldTouched(key);
  };

  const handleSelectTouch = (key: string): void => {
    setFieldTouched(key);
  };

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setItems((prevCards: any) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      }),
    );
  }, []);

  //   const renderCard = useCallback((card: { id: number; text: string }, index: number) => {
  const renderCard = useCallback(
    (
      item: {
        id: string;
        content: string;
        checked: boolean;
        pre_selected: boolean;
      },
      index: number,
      handleRadioChange: any,
      handleCheckboxChange: any,
    ) => {
      return (
        <SortableItem
          key={uuidv4()}
          id={item.id}
          item={item}
          items={items}
          isViewOnly={isViewOnly}
          setItems={setItems}
          content={item.content}
          index={index}
          // key={item.id}
          itemsRef={itemsRef}
          moveCard={moveCard}
          handleRadioChange={handleRadioChange}
          handleCheckboxChange={handleCheckboxChange}
        />
      );
    },
    [],
  );

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>, data: any) => {
    // const updateData = items.map((item: any) => ({
    //   ...item,
    //   pre_selected: item.id === data.id,
    // }));
    // setItems(updateData);
    let updatedCheckbox = items.map((item: any) => {
      if (item.id === data.id) {
        return {
          ...item,
          pre_selected: event.target.checked,
        };
      }
      return { ...item, pre_selected: false };
    });

    setItems(updatedCheckbox);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, data: any) => {
    // let convertedValues = items.map((item: any) => {
    //   if (item.id === data.id) {
    //     return {
    //       ...item,
    //       checked: event.target.checked,
    //     };
    //   }
    //   return item;
    // });
    // setItems(convertedValues);
    // setItems(updatedCheckbox);
    const findItem = items.find((item: any) => item.id === data.id);
    findItem.checked = event.target.checked;
    setItems([...items]);
  };

  return (
    <Box
      className="setting-form-group"
      sx={{
        margin: '0px 20px 0px 25px',
      }}>
      <Grid
        item
        xs={12}
        sx={{
          mb: 2,
        }}>
        <Alert severity="info">
          {' '}
          Select membership plans that these member can upgrade/downgrade their accounts to.
        </Alert>
      </Grid>

      <DndProvider backend={HTML5Backend}>
        <div>
          {items.map((it: any, i: number) =>
            renderCard(it, i, handleRadioChange, handleCheckboxChange),
          )}
        </div>
      </DndProvider>
    </Box>
  );
};

interface SortableItemProps {
  id: string;
  content: string;
  items: any;
  setItems?: any;
  item: any;
  index: number;
  itemsRef?: any;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  key: string | number;
  handleRadioChange: any;
  handleCheckboxChange: any;
  isViewOnly: boolean;
}
interface DragItem {
  index: number;
}

const SortableItem: React.FC<SortableItemProps> = ({
  itemsRef,
  content,
  items,
  setItems,
  item,
  index,
  moveCard,
  id,
  key,
  handleRadioChange,
  handleCheckboxChange,
  isViewOnly,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: 'item',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'item',
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const newData = items.filter((item: any) => item.id === 0);
  return (
    <div
      key={key}
      ref={ref}
      style={{
        opacity,
      }}
      data-handler-id={handlerId}>
      <Card
        variant="outlined"
        style={{
          marginTop: '10px',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: item.id === 0 ? '#13131429' : '#fff',
        }}>
        <DragIndicatorIcon
          style={{
            marginRight: '10px',
          }}
        />
        {/* <FormControlLabel
          control={
            <Radio
              checked={item.pre_selected}
              onChange={(e) => handleRadioChange(e, item)}
              name={item?.checkboxUID}
              disabled={isViewOnly}
              inputProps={{ 'aria-label': item.id }}
            />
          }
          label="Pre-selected"
        />
        <FormControlLabel
          control={<Checkbox onChange={(e) => handleCheckboxChange(e, item)} />}
          label={item.content}
          disabled={isViewOnly}
          checked={item.checked}
          name={item?.checkboxUID}
        /> */}
        {item.content}
      </Card>
    </div>
  );
};

export const BillingPlanStepFour: FC<IProps> = ({
  formikBag,
  isViewOnly,
  loading,
  setFeaturesCheckbox,
  featuresCheckbox,
}) => {
  const { errors, values, touched, setFieldValue, setFieldTouched, handleChange, handleBlur } =
    formikBag;

  // React.useState(() => {
  //   setFieldValue('features', featuresCheckbox);
  // }, []);

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const key = ev.target.name;
    handleChange(ev);
    setFieldTouched(key);
  };

  const handleSelectTouch = (key: string): void => {
    setFieldTouched(key);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, item: any) => {
    const OptionsItems = featuresCheckbox.map((item: any) => {
      if (item.id === event.target.value) {
        return {
          ...item,
          checked: event.target.checked,
        };
      } else {
        return {
          ...item,
        };
      }
    });

    setFeaturesCheckbox(OptionsItems);
  };

  return (
    <Box
      className="setting-form-group"
      sx={{
        margin: '0px 20px 0px 25px',
      }}>
      <Grid container spacing={4} className="formGroupItem">
        <Grid item xs={6}>
          <Grid item xs={12}>
            <InputLabel htmlFor="timeZone">
              <div className="label-heading">No of Organizations</div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <OutlinedInput
                type="number"
                id="outlined-adornment-amount"
                name="no_of_organizations"
                value={values.no_of_organizations}
                onChange={handleInputChange}
                onBlur={() => handleSelectTouch('no_of_organizations')}
                disabled={isViewOnly}
                error={touched.no_of_organizations && Boolean(errors.no_of_organizations)}
                endAdornment={
                  <InputAdornment position="start">
                    {' '}
                    <CorporateFareIcon />{' '}
                  </InputAdornment>
                }
              />
              {/* <FormHelperText id="billing-component-helper-text">dummy text here</FormHelperText> */}
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item xs={12}>
            <InputLabel htmlFor="timeZone">
              <div className="label-heading">No of Users per Organizations</div>
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <OutlinedInput
                type="number"
                id="outlined-adornment-amount"
                name="no_of_users"
                value={values.no_of_users}
                onChange={handleInputChange}
                onBlur={() => handleSelectTouch('no_of_users')}
                disabled={isViewOnly}
                error={touched.no_of_users && Boolean(errors.no_of_users)}
                endAdornment={
                  <InputAdornment position="start">
                    {' '}
                    <BadgeIcon />{' '}
                  </InputAdornment>
                }
              />
              {/* <FormHelperText id="billing-component-helper-text">dummy text here</FormHelperText> */}
            </FormControl>
          </Grid>
        </Grid>

        {featuresCheckbox.map((item: any) => (
          <Grid item xs={6}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox onChange={handleCheckboxChange} />}
                label={item.title}
                value={item.id}
                checked={item.checked}
                disabled={item.disabled || isViewOnly}
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
