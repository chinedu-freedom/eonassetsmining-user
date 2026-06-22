import { NumericFormat } from "react-number-format";

export default function CurrencyFormatter({ amount }) {
  if (!amount) return;

  return (
    <NumericFormat
      value={amount}
      displayType="text"
      thousandSeparator=","
      prefix="$"
    />
  );
}
