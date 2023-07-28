import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/apiClient';
import { Loader } from '../../components/UI/components/Loader/Loader';
import { Grid, Paper } from '@mui/material';
import ErrorMessage from '../../components/UI/components/ErrorMessage/ErrorMessage';
import TokenInfoBlock from './TokenInfoBlock';
import { formatWithCommas } from '../../utils/formatting';


const mapWallet = (walletData) => {
  return {
    id: walletData.id,
    logoURL: walletData.logo_url,
    tokensInWallet: walletData.tokens_in_wallet,
    name: walletData.wallet,
  };
};

const SendTokens = () => {

  const [walletList, setWalletList] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  // when the page is first rendered
  useEffect(() => {
    const loadWallets = async () => {
      try {
        // TODO: default limit
        const wallets = await apiClient.get('/wallets?limit=200');
        setWalletList(wallets.data.wallets.map(wallet => mapWallet(wallet)));
      } catch (error) {
        console.error(error);
        setErrorMessage('An error occured while fetching wallet data.');
      } finally {
        setIsLoading(false);
      }
    };
    loadWallets();
  }, []);


  if (isLoading) return <Loader />;

  const defaultWallet = walletList.length > 0 ? walletList[0] : {
    id: '',
    logoURL: '',
    tokensInWallet: 0,
    name: '',
  };

  return (
    <Grid>
      <header style={{ marginTop: '18vh', height: '10vh' }}>Send Tokens</header>
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}

      <Paper elevation={3}>
        <TokenInfoBlock totalTokens={formatWithCommas(defaultWallet.tokensInWallet)}
                        subWalletName={''}
                        subWalletTokens={''} />
      </Paper>

    </Grid>
  );
};

export default SendTokens;
