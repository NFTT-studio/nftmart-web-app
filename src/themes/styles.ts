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
    '.swiper-wrapper': {
      width: '207px !important',
    },
    '.react-date-picker': {
      width: '100%',
      height: '100%',
    },
    '.react-date-picker__wrapper': {
      border: 'none !important',
      color: '#000000',
    },
    '.react-date-picker__inputGroup__input:invalid': {
      background: '#FFFFFF',
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
    '.css-1sbcbqr': {
      span: {
        width: '130px !important',
        display: 'inline-block',
        test: {
          width: '30px !important',
          display: 'inline-block',
        },
      },
    },
    '.identicon svg': {
      position: 'absolute',
      bottom: '-54px',
      border: '3px solid #FFFFFF',
      m: '0 40px',
      boxShadow: '0px 6px 20px 0px #D3D5DC',
      background: '#FFFFFF',
      borderRadius: '50%',
      width: 'auto !important',
      height: '108px !important',
      objectFit: 'cover',
    },
    '.identiconH5 svg': {
      position: 'absolute',
      bottom: '-50px',
      left: 'calc(50% - 50px)',
      border: '3px solid #FFFFFF',
      boxShadow: '0px 6px 20px 0px #D3D5DC',
      background: '#FFFFFF',
      borderRadius: '50%',
      width: 'auto !important',
      height: '100px !important',
      objectFit: 'cover',
    },
    '.userAvatar svg': {
      marginRight: '4px',
      background: '#FFFFFF',
      width: 'auto !important',
      height: '26px !important',
      borderRadius: '50%',
      border: '1px solid #FFFFFF',
    },
    '.userAvatarh5 svg': {
      marginRight: '4px',
      background: '#FFFFFF',
      width: 'auto !important',
      height: '17px !important',
      borderRadius: '50%',
      border: '1px solid #FFFFFF',
    },
    '.ownerAvatar svg': {
      marginRight: '4px',
      background: '#FFFFFF',
      width: '50px !important',
      height: 'auto !important',
      borderRadius: '50%',
      border: '1px solid #D3D5DC',
    },
    '.ownerAvatarh5 svg': {
      marginRight: '4px',
      background: '#FFFFFF',
      width: '25px !important',
      height: 'auto !important',
      borderRadius: '50%',
      border: '1px solid #D3D5DC',
    },
    '.creatorAvatar svg': {
      marginRight: '4px',
      background: '#FFFFFF',
      width: '50px !important',
      height: 'auto !important',
      borderRadius: '50%',
      border: '1px solid #D3D5DC',
    },
    '.creatorAvatarH5 svg': {
      marginRight: '4px',
      background: '#FFFFFF',
      width: '25px !important',
      height: 'auto !important',
      borderRadius: '50%',
      border: '1px solid #D3D5DC',
    },
    '.headerAvatar svg': {
      marginLeft: '40px',
      marginRight: '8px',
      background: '#FFFFFF',
      width: '32px !important',
      height: '32px !important',
      borderRadius: '50%',
      border: '1px solid #D3D5DC',
    },
    '.video-react-big-play-button': {
      width: '54px !important',
      height: '54px!important',
      borderRadius: '50% !important',
      lineHeight: '50px !important',
      top: 'calc(50% - 27px) !important',
      left: 'calc(50% - 27px) !important',
    },
    '.video-react-poster': {
      height: '100% !important',
      backgroundRepeat: 'no-repeat !important',
      backgroundSize: 'cover !important',
    },
    '.video-react-fluid': {
      height: '100% !important',
    },
    '.browsingScroll': {
      width: '100% !important',
    },
    '.infinite-scroll-component__outerdiv': {
      width: '100% !important',
    },
    '.container': {
      width: '100% !important',
      maxWidth: '100% !important',
    },
    '.public-DraftEditor-content': {
      height: 'auto !important',
    },
    '.DraftEditor-editorContainer': {
      height: 'auto !important',
    },
    '.editor-statusbar': {
      display: 'none',
    },
    '.EasyMDEContainer .CodeMirror-scroll': {
      minHeight: '100px !important',
      width: '100%',
    },
    '.EasyMDEContainer .CodeMirror h1, h2, h3, h4, h5, h6': {
      fontSize: 'revert',
      fontWeight: 'revert',
    },
    '.EasyMDEContainer .CodeMirror a': {
      color: 'blue',
    },
    '.cm-spell-error:not(.cm-url):not(.cm-comment):not(.cm-tag):not(.cm-word)': {
      background: 'none !important',
    },
    '.editor-preview': {
      padding: '0 20px !important',
    },
    '.markdown a': {
      color: 'blue',
    },
    '.markdown h1, h2, h3, h4, h5, h6': {
      fontSize: 'revert',
      fontWeight: 'revert',
    },
  }),
};

export default obj;
