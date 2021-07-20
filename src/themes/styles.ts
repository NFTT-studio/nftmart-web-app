const obj = {
  global: () => ({
    // font
    'html, body': {
      // fontFamily: "PingFangSC-Regular, PingFang SC;",
      width: '100%',
      height: '100%',
    },
    body: {
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
    },

    ':focus': {
      outline: 'none',
      boxShadow: 'none',
    },
    '.css-xzjcmu': {
      maxWidth: '1360px',
    },
    '.swiper-container-horizontal>.swiper-scrollbar': {
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
  }),
};

export default obj;
