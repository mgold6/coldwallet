"use client";

interface Wallet {
  id: string;
  currency: {
    code: string;
    name: string;
  };
}


interface TokenSelectorProps {
  wallets: Wallet[];
  selectedWallet: string;
  onChange: (id: string) => void;
}


export default function TokenSelector({
  wallets,
  selectedWallet,
  onChange,
}: TokenSelectorProps) {


  return (

    <select
      value={selectedWallet}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        rounded-2xl
        border
        border-slate-700
        bg-slate-900
        p-4
        text-white
        outline-none
      "
    >

      {wallets.map((wallet) => (

        <option
          key={wallet.id}
          value={wallet.id}
        >

          {wallet.currency.name}
          {" "}
          ({wallet.currency.code})

        </option>

      ))}


    </select>

  );

}