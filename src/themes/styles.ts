import { none } from 'ramda';

const obj = {
  global: () => ({
    // font
    'html, body': {
      // fontFamily: "PingFangSC-Regular, PingFang SC;",
      width: '100%',
      minHeight: '100%',
    },
    body: {
      position: 'relative',
      minHeight: '100%',
    },
    a: {
      _hover: {
        textDecoration: 'none',
      },
    },
    '#root': {
      position: 'relative',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },

    'footer.page-footer': {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '-151px',
      border: 'none',
      overflow: 'hidden',
    },

    ':focus': {
      outline: 'none',
      boxShadow: 'none',
    },
    '.css-xzjcmu': {
      maxWidth: '1364px',
    },
    '.swiper-container-horizontal>.swiper-scrollbar': {
      width: '1364px',
      height: '16px',
      background: '#F8F8F9',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    '.swiper-scrollbar-drag': {
      height: '8px',
      background: '#E5E5E5',
    },
    '.swiper-container': {
      width: '100%',
    },
    '.react-date-picker': {
      width: '100%',
      height: '100%',
    },
    '.react-date-picker__wrapper': {
      border: 'none',
    },
    '.recharts-cartesian-axis-ticks': {
      background: '#F8F9FA',
      width: '705px',
      height: '40px',
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '.css-1b2twv6': {
      width: '38px !important',
      height: '16px !important',
      borderRadius: '10px !important',
      border: 'none !important',
      boxShadow: 'none !important',
    },
    '.chakra-switch__thumb': {
      width: '16px !important',
      height: '16px !important',
      background: '#FFFFFF !important',
      border: 'none !important',
      boxShadow: 'none !important',
    },
    '.css-1b2twv6[data-checked]': {
      border: 'none !important',
      boxShadow: 'none !important',
    },
    '.css-1b2twv6[aria-checked=true], .css-1b2twv6[data-checked]': {
      background: '#000000 !important',
      border: 'none',
      boxShadow: 'none',
    },
    '.css-1b2twv6[aria-checked=true]:focus, .css-1b2twv6[data-checked]:focus': {
      background: '#000000 !important',
      border: 'none',
      boxShadow: 'none',
    },
    '.css-rwn23e': {
      background: '#000000 !important',
    },
  }),
};

export default obj;
