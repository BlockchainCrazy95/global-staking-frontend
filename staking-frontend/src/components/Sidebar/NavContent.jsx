import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import styled from 'styled-components';
import { ReactComponent as StakeIcon } from "../../assets/icons/stake.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard.svg";
import { ReactComponent as OlympusIcon } from "../../assets/icons/olympus-nav-header.svg";
import { ReactComponent as PoolTogetherIcon } from "../../assets/icons/33-together.svg";
import { ReactComponent as ZapIcon } from "../../assets/icons/zap.svg";
import { ReactComponent as NewIcon } from "../../assets/icons/new-icon.svg";
import { ReactComponent as WrapIcon } from "../../assets/icons/wrap.svg";
import { ReactComponent as BridgeIcon } from "../../assets/icons/bridge.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { trim, shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "src/hooks/web3Context"
import { Paper, Link, Box, Typography as Typograp, SvgIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";
import LogoImg from '../../assets/icons/olympus-nav-header.png'





function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const { chainID } = useWeb3Context();

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    return false;
  }, []);

  const isActiveFc = useCallback((name) => {
    return checkPage(null, window.location, name)
  }, [window.location])
  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://crypstarter.finance/" target="_blank">
              {/* <SvgIcon
                color="primary"
                component={OlympusIcon}
                viewBox="0 0 151 100"
                style={{ minWdth: "151px", minHeight: "98px", width: "151px" }}
              /> */}
              <img src={LogoImg} alt="" style={{ width: "151px" }} />
            </Link>

            {address && (
              <div className="wallet-link">
                <Link href={`https://bscscan.io/address/${address}`} target="_blank">
                  {shorten(address)}
                </Link>
              </div>
            )}
          </Box>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
          <div className="dapp-menu-external-links">
            {Object.keys(externalUrls).map((link, i) => {
              return (
                <Link key={i} href={`${externalUrls[link].url}`} target="_blank">
                  <Typography variant="h6">{externalUrls[link].icon}</Typography>
                  <Typography variant="h6">{externalUrls[link].title}</Typography>
                </Link>
              );
            })}
          </div>
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;



const ANavIcon = styled.div`
  width:20px;
  height: 20px;
  background-image: url(${props => props.bg1});
  background-size: 100%;
  margin-right:12px;
`

const ANavLink = styled(Link)`
  &:hover,&.active{
    text-decoration:none;
    h6{
    }
    ${ANavIcon}{
      background-image: url(${props => props.bg2});
    }
  }
`

const Typography = styled(Typograp)`
  display: flex;
  align-items: center;
`
