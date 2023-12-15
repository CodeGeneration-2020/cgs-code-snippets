type Props = {
    isScreen: boolean;
  };
  
  const PurchaseScreen: FC<Props> = ({ isScreen }) => {
    const [subscriptions, setSubscriptions] = useState<PurchasesPackage[]>([]);
    const [selected, setSelected] = useState<PurchasesPackage | undefined>(undefined);
    const dispatch = useCustomDispatch();
    const isIOS = Platform.OS === 'ios';
  
    const fetchSubscriptions = useCallback(async () => {
      try {
        const offerings = await Purchases.getOfferings();
        setSubscriptions(offerings.current?.availablePackages || []);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    }, []);
  
    useEffect(() => {
      fetchSubscriptions();
    }, [fetchSubscriptions]);
  
    const openLink = (link: string) => Linking.openURL(link);
  
    const handleRestore = async () => await dispatch(restorePurchase());
  
    const handlePurchase = () => dispatch(buySubscription(selected));
  
    return (
      <StyledBackground>
        <StyledScrollView
          refreshControl={<ThemedRefreshControl refreshing={false} onRefresh={fetchSubscriptions} />}
        >
          <StyledHeader isScreen={isScreen}>
            {!!isScreen && <StyledButtonRow><GoBackButton /></StyledButtonRow>}
            <StyledTitle>Unlock Premium</StyledTitle>
            <StyledSubtitle>Enhance your experience with Premium features</StyledSubtitle>
            <SubscriptionList
              subscriptions={subscriptions}
              selected={selected}
              onSelect={setSelected}
            />
          </StyledHeader>
  
          {subscriptions.length !== 0 ? (
            <>
              <StyledSubscriptions>
                {subscriptions.map(subscription => (
                  <SubscriptionItem key={subscription.identifier} subscription={subscription} />
                ))}
              </StyledSubscriptions>
              <StyledTermsButton onPress={handleRestore}>Restore Purchase</StyledTermsButton>
  
              {isIOS && <StyledRenew>Apple disclaimer goes here</StyledRenew>}
  
              <StyledTerms>
                <StyledTermsButton onPress={() => openLink(CONFIG.TERMS_LINK)}>Terms of Service</StyledTermsButton>
                <StyledTermsButton onPress={() => openLink(CONFIG.PRIVACY_LINK)}>Privacy Policy</StyledTermsButton>
              </StyledTerms>
            </>
          ) : (
            <>
              <CustomActivityIndicator size="large" />
              <StyledFetching>Loading subscriptions...</StyledFetching>
            </>
          )}
        </StyledScrollView>
        <StyledFixedContainer>
          {!!selected && <CustomPrimaryButton onPress={handlePurchase} title={`Purchase ${selected.packageType}`} />}
        </StyledFixedContainer>
      </StyledBackground>
    );
  };
  
  export default memo(PurchaseScreen);
