import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
// import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import TinyFlag from 'tiny-flag-react';

function flagURL(code) {
  return `https://cdn.jsdelivr.net/npm/react-flagkit@1.0.2/img/SVG/${code}.svg`;
}
const languageMap = {

  en: {
    label: (
      <>
        <TinyFlag
          style={{ marginRight: '7px' }}
          country={'US'}
          alt={'US' + ' Flag'}
          fallbackImageURL={flagURL('US')}
        />{' '}
        <span
          style={{
            marginLeft: '  18px',
            fontSize: '1rem',
            fontFamily: 'Poppins,sans-serif',
            fontWeight: '400',
            lineHeight: '1.5',
          }}
        >
          English
        </span>
      </>
    ),
    dir: 'ltr',
    active: true,
  },
  it: {
    label: (
      <>
        <TinyFlag
          country={'IT'}
          alt={'US Flag'}
          fallbackImageURL={flagURL('IT')}
        />{' '}
        <span
          style={{
            marginLeft: '  18px',
            fontSize: '1rem',
            fontFamily: 'Poppins,sans-serif',
            fontWeight: '400',
            lineHeight: '1.5',
          }}
        >
          Italiano
        </span>
      </>
    ),
    dir: 'rtl',
    active: false,
  },
  //   fr: { label: 'Français', dir: 'ltr', active: false },
};

const LanguageSelect = () => {
 
const data = localStorage.getItem('i18nextLng');

useEffect(() => {
  if (data === 'en-US') {
    localStorage.setItem('i18nextLng', 'en');
  }


}, [data]);


  const { t } = useTranslation();

  const [menuAnchor, setMenuAnchor] = React.useState(null);
    let selected = localStorage.getItem('i18nextLng') || 'en';
useEffect(() => {
    if (document && document.body && document.body.dir) {
      document.body.dir = languageMap[selected].dir;
    }
 
  }, [menuAnchor, selected]);

  return (
    <div className="languageButtonFlag">
      <p
        // className="lnguageChangeButton"
        style={{ paddingLeft: '1px' }}
        onClick={({ currentTarget }) => {
          setMenuAnchor(currentTarget);
        }}
      >
        {selected === 'en' 
          ? 
          languageMap &&
              languageMap.en &&
              languageMap.en.label &&
            languageMap.en.label
          :
           languageMap &&
            languageMap[selected] &&
            languageMap[selected].label &&

            languageMap[selected].label}
        <KeyboardArrowDownIcon
          fontSize="small"
          style={{
            verticalAlign: 'middle',
          }}
        />
      </p>
      <Popover
        style={{ marginTop: '16px' }}
        open={!!menuAnchor}
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div
          style={{
            marginTop: '10px',
          }}
        >
          {/* <List> */}
          {/* <ListSubheader>{t('select_language')}</ListSubheader> */}
          {Object.keys(languageMap)?.map((item) => (
            <ListItem
              button
              key={item}
              onClick={() => {
                i18next.changeLanguage(item);
                setMenuAnchor(null);
              }}
            >
              {languageMap[item].label}
            </ListItem>
          ))}
          {/* </List> */}
        </div>
      </Popover>
    </div>
  );
};

export default LanguageSelect;
