import React, { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate, useLocation } from 'react-router-dom';

const Index = ({ navigationActive }: any) => {
  let { activeNav = '', setActiveNav = () => {} } = navigationActive;
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className={`bottom__template-navigation ${openNav ? 'show__nav' : ''}`}>
      <div
        onClick={(e: any) => {
          setOpenNav((prev: boolean) => !prev);
        }}
        className={`icon ${openNav ? 'active' : ''}`}>
        <KeyboardArrowDownIcon />
      </div>
      <section className="bottom__container">
        <div className="bottom__container-box">
          <div
            className={`${activeNav === 'TEMPLATE' ? 'active' : ''}  `}
            onClick={() => {
              setActiveNav('TEMPLATE');
              // navigate(`${location.pathname}`);
            }}>
            Go To Template
          </div>
          <div
            className={`${activeNav === 'Mobile Preview' ? 'active' : ''}  `}
            onClick={() => {
              setActiveNav('Mobile Preview');
              // navigate(`${location.pathname}?mobile-preview`);
            }}>
            Mobile Preview
          </div>
        </div>
      </section>
    </nav>
  );
};

export default Index;
