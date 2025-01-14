import React from "react";
import { Container, Button, Stack, Typography, Box } from "@mui/material";
import { WalletName } from "@massalabs/wallet-provider";

interface SelectMassaWalletProps {
  onClick: (providerName: WalletName) => void;
}

const walletsConfig = [
  {
    name: "MASSASTATION",
    walletType: WalletName.MassaStation,
    imgSrc: "/assets/images/massa-station.png",
    imgAlt: "Massa Station logo",
  },
  {
    name: "BEARBY",
    walletType: WalletName.Bearby,
    imgSrc: "/assets/images/bearby.png",
    imgAlt: "Bearby logo",
  },
];

const SelectMassaWallet = ({ onClick }: SelectMassaWalletProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "0px 0px 16px",
      }}
    >
      {walletsConfig.map((wallet) => (
        <Button
          key={wallet.name}
          variant="outlined"
          fullWidth
          onClick={() => onClick(wallet.walletType)}
          sx={{
            height: "64px",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: "20px",

            border: "none",
            backgroundColor: "rgba(0, 0, 0, 0.075)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.125)",
              // borderColor: "rgba(0, 0, 0, 0.125)",
            },
            borderRadius: "8px",
            // py: 1.5,
            // px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            textTransform: "none",
            transition: "background-color 0.3s",
          }}
        >
          <Typography
            variant="h5"
            component="span"
            fontWeight={500}
            sx={{ color: (theme) => theme.palette.neutral.dark }}
          >
            {`${wallet.name}`}
          </Typography>
          <img
            src={wallet.imgSrc}
            alt={wallet.imgAlt}
            style={{ width: 24, height: 24, marginRight: 12 }}
          />
        </Button>
      ))}
    </Box>
  );
};

export default SelectMassaWallet;
