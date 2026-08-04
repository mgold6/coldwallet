"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AssignWalletDialogProps = {
  userId: string;
  userName: string;
};

export default function AssignWalletDialog({
  userId,
  userName,
}: AssignWalletDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm">
            Assign Wallet
          </Button>
        }
      />

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Assign Wallet</DialogTitle>

          <DialogDescription>
            Assign a cryptocurrency wallet to <strong>{userName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Portfolio</Label>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select portfolio" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="default">
                  Default Portfolio
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Currency</Label>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="BTC">Bitcoin</SelectItem>
                <SelectItem value="ETH">Ethereum</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="SOL">Solana</SelectItem>
                <SelectItem value="XRP">XRP</SelectItem>
                <SelectItem value="ADA">Cardano</SelectItem>
                <SelectItem value="BNB">BNB</SelectItem>
                <SelectItem value="AVAX">Avalanche</SelectItem>
                <SelectItem value="DOGE">Dogecoin</SelectItem>
                <SelectItem value="LTC">Litecoin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Network</Label>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select network" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="BTC">Bitcoin</SelectItem>
                <SelectItem value="ERC20">ERC20</SelectItem>
                <SelectItem value="TRC20">TRC20</SelectItem>
                <SelectItem value="BEP20">BEP20</SelectItem>
                <SelectItem value="SOL">Solana</SelectItem>
                <SelectItem value="AVAX">Avalanche</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Wallet Address</Label>

            <Input placeholder="Enter wallet address" />
          </div>

          <div className="space-y-2">
            <Label>Wallet Label</Label>

            <Input placeholder="Primary BTC Wallet" />
          </div>

          <div className="flex justify-end">
            <Button>
              Assign Wallet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}