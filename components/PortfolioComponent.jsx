import styles from "../styles/PortfolioComponent.module.css";
import { useState, useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";

import { networks, fetchPortfolio } from "../pages/api/PortfolioComponent";

const PortfolioComponent = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!networks[chain.id]) {
      setError("Chain Not Supported");
      return;
    }

    setLoading(true);
    fetchPortfolio(chain.id, address)
      .then((data) => setPortfolio(data))
      .finally(() => setLoading(false));
  }, [chain?.id]);

  return (
    <div className={styles.container}>
      {error ? (
        <div>{error}</div>
      ) : loading ? (
        <div>Fetching portfolio...</div>
      ) : (
        <>
          <h2>User Portfolio</h2>
          {portfolio.length > 0 ? (
            <ul className={styles.list}>
              {portfolio.map((token, index) => (
                <li key={index} className={styles.listItem}>
                  {token.tokenData.logo && (
                    <img className={styles.image} src={token.tokenData.logo} />
                  )}
                  <div>
                    <p className={styles.tokenName}>{token.tokenData.name}</p>
                    <p>{token.tokenBalance}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div>No token found</div>
          )}
        </>
      )}
    </div>
  );
};

export default PortfolioComponent;
