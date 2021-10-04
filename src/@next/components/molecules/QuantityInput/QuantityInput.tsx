import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { TextField } from "@components/molecules";
import { commonMessages } from "@temp/intl";

export interface IQuantityInput {
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  disabled: boolean;
  onQuantityChange: (value: number) => void;
  hideErrors: boolean;
  /**
   * Used as marker for writing e2e tests
   */
  testingContext: string;
  /**
   * Used as marker for writing e2e tests. Use unique ID to differentiate
   * multiple elements in the same view from each other
   */
  testingContextId?: string;
}

export const QuantityInput: React.FC<IQuantityInput> = ({
  disabled,
  quantity,
  minQuantity,
  maxQuantity,
  onQuantityChange,
  hideErrors,
  testingContext,
  testingContextId,
}) => {
  const [isTooMuch, setIsTooMuch] = useState(false);
  const [isTooFew, setIsTooFew] = useState(false);
  const intl = useIntl();

  if (!minQuantity) minQuantity = 1;
  if (quantity < minQuantity) {
    quantity = minQuantity;
  }

  useEffect(() => {
    setIsTooMuch(!isNaN(quantity) && quantity > maxQuantity);
    setIsTooFew(!isNaN(quantity) && quantity < minQuantity);
  }, [quantity, minQuantity, maxQuantity]);

  const handleQuantityChange = (evt: React.ChangeEvent<any>) => {
    const newQuantity = parseInt(evt.target.value, 10);

    if (quantity !== newQuantity) {
      onQuantityChange(newQuantity);
    }
    setIsTooFew(!isNaN(newQuantity) && newQuantity < minQuantity);
    setIsTooMuch(!isNaN(newQuantity) && newQuantity > maxQuantity);
  };

  const quantityErrors: any = () => {
    if (!hideErrors) {
      if (isTooMuch) {
        return [
          {
            message: intl.formatMessage(commonMessages.maxQtyIs, {
              maxQuantity,
            }),
          },
        ];
      }

      if (isTooFew) {
        return [
          {
            message: intl.formatMessage(commonMessages.minQtyIs, {
              minQuantity,
            }),
          },
        ];
      }
    }
    return undefined;
  };

  return (
    <TextField
      name="quantity"
      type="number"
      label={intl.formatMessage(commonMessages.quantity)}
      min="{minQuantity.toString()}"
      value={quantity.toString()}
      disabled={disabled}
      onChange={handleQuantityChange}
      errors={quantityErrors}
      data-test={testingContext}
      data-testId={testingContextId}
    />
  );
};
QuantityInput.displayName = "QuantityInput";
export default QuantityInput;
