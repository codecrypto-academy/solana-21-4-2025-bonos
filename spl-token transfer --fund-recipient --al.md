spl-token transfer --fund-recipient --allow-unfunded-recipient \
$(cat token-info.json | jq -r .tokens.euroCC.mint) \
10000 \
$(cat token-info.json | jq -r .tokens.bonoDeuda.mint) \
 --owner ../wallets/adquirente1.json