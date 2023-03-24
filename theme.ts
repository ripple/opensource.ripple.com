import { lighten, darken, readableColor } from 'polished';

/* https://redocly.com/docs/developer-portal/configuration/theme/ */

export const theme = {
  // spacing: {
  //   unit: 5,
  //   sectionHorizontal: ({ spacing }) => spacing.unit * 8,
  //   sectionVertical: ({ spacing }) => spacing.unit * 8,
  // },
  breakpoints: {
    xs: 0,
    small: '550px',
    medium: '900px',
    large: '1200px',
  },

  logo: {
    height: '1.3rem',
    maxWidth: '100%',
    margin: 0,
  },

  colors: {
    tonalOffset: 0.2,
    RippleBrand: {
      main: '#003D99',
      contrastText: '#ffffff',
    },
    primary: {
      contrastText: '#ffffff',
      main: ({ colors }) => colors.text.primary,
      // light: ({ colors }) => lighten(colors.tonalOffset, colors.primary.main),
      // dark: ({ colors }) => darken(colors.tonalOffset, colors.primary.main),
      // contrastText: ({ colors }) => readableColor(colors.primary.main),
    },
    accent: {
      main: '#005BCC',
    },
    headings: {
      main: '#003D99',
    },
    links: {
      main: '#003D99',
    },
    error: {
      main: '#BD0F5A',
      light: '#FFE6EB',
      dark: ({ colors }) => darken(colors.tonalOffset, colors.error.main),
      contrastText: ({ colors }) => colors.error.main,
    },
    info: {
      main: '#003D99',
      light: '#E6F8FF',
      dark: ({ colors }) => darken(colors.tonalOffset, colors.info.main),
      contrastText: ({ colors }) => colors.info.main,
    },
    success: {
      main: '#006622',
      light: '#F4FFE6',
      dark: ({ colors }) => darken(colors.tonalOffset, colors.success.main),
      contrastText: ({ colors }) => colors.success.main,
    },
    warning: {
      main: '#992700',
      light: '#FFF2E6',
      dark: ({ colors }) => darken(colors.tonalOffset, colors.warning.main),
      contrastText: ({ colors }) => colors.warning.main,
    },
    text: {
      primary: '#141A1F',
      secondary: '#5E676E',
    },
    jumbotronButton: {
      main: '#005BCC',
      contrastText: '#F8FAFC',
    },
    // border: {
    //   dark: 'rgba(0,0,0, 0.15)',
    //   light: '#ffffff',
    // },
    responses: {
      success: {
        color: ({ colors }) => colors.success.main,
        backgroundColor: ({ colors }) => colors.success.light,
      },
      error: {
        color: ({ colors }) => colors.error.main,
        backgroundColor: ({ colors }) => colors.error.light,
      },
      redirect: {
        color: ({ colors }) => colors.warning.main,
        backgroundColor: ({ colors }) => colors.warning.light,
      },
      info: {
        color: ({ colors }) => colors.info.main,
        backgroundColor: ({ colors }) => colors.info.light,
      },
    },
    http: {
      get: '#6bbd5b',
      post: '#248fb2',
      put: '#9b708b',
      options: '#d3ca12',
      patch: '#e09d43',
      delete: '#e27a7a',
      basic: '#999',
      link: '#31bbb6',
      head: '#c167e4',
    },
    /* Sets the color variations for the navigation bar.
    Additional theming options can be set in the main navbar section of the portal theme.
    */
    navbar: {
      gradient: '#ffffff',
      main: '#ffffff',
      contrastText: ({ colors }) => colors.text.primary,
    },
    footer: {
      main: '#ffffff',
      contrastText: ({ colors }) => colors.text.secondary,
    },
  },

  /* Controls the appearance of the portal navbar.
  You must define the contents of the navigation bar in the nav section of the siteConfig.yaml file.
  */
  navbar: {
    activeBgColor: '#ffffff',
    activeTextColor: '#005BCC',
    position: 'sticky',
    zIndex: 50,
    top: '0',
    left: '0',
    right: '0',
    fontSize: '16px',
    fontFamily: '"TT Ripple", sans-serif',
    fontWeight: 600,
    lineHeight: '1.5em',
    /*  activeTextDecoration: '',   */
    /*  borderRadius: '',           */
    /*  marginHorizontal: '',       */
    /*  marginVertical: '',         */
  },

  sidebar: {
    /* activeBgColor: '', */
    activeTextColor: "#005BCC",
    backgroundColor: "#ffffff",
    /* borderRadius: '', */
    caretColor: "#777F86",
    fontfamily: '"TT Ripple", sans-serif',
    fontSize: "14px",
    /* rightLineColor: '', */
    /* separatorLabelColor: '', */
    /* separatorLineColor: '', */
    /* showAtBreakpoint: '', */
    /*   spacing: {
      offsetLeft: '16',
      offsetNesting: '16',
      offsetTop: '16',
      paddingHorizontal: '',
      paddingVertical: '',
      unit: '8',
    },  */
    textColor: ({ colors }) => colors.text.primary,
    textColorSecondary: "#777F86",
    width: "240px",
  },

  tocPanel: {
    width: "180px",
    color: ({ colors }) => colors.text.primary,
    activeTextColor: ({ colors }) => colors.accent.main,
    activeBgColor: "#ffffff",
    backgroundcolor: "#ffffff",
  },

  typography: {
    fontSize: "16px",
    lineHeight: "24px",
    fontWeightRegular: "400",
    fontWeightBold: "600",
    fontWeightLight: "300",
    fontFamily: '"TT Ripple", sans-serif',
    smoothing: "antialiased",
    textSizeAdjust: "100%",
    headings: {
      fontFamily: '"TT Ripple", sans-serif',
      fontWeight: "600",
    },
    heading1: {
      fontSize: "36px",
      lineHeight: "48px",
      color: ({ colors }) => colors.headings.main,
    },
    heading2: {
      fontSize: "26px",
      lineHeight: "36px",
      color: ({ colors }) => colors.headings.main,
    },
    heading3: {
      fontSize: "22px",
      lineHeight: "32px",
      color: ({ colors }) => colors.headings.main,
    },
    heading4: {
      fontSize: "19px",
      lineHeight: "24px",
      color: ({ colors }) => colors.headings.main,
    },
    heading5: {
      fontSize: "16px",
      lineHeight: "24px",
      color: ({ colors }) => colors.headings.main,
    },
    heading6: {
      fontSize: "16px",
      lineHeight: "24px",
      color: ({ colors }) => colors.headings.main,
    },
    code: {
      fontSize: "14px",
      lineHeight: "20px",
      fontFamily: '"Space Mono", monospace',
      fontWeight: ({ typography }) => typography.fontWeightRegular,
      color: ({ colors }) => colors.text.primary,
      backgroundColor: "rgba(38, 50, 56, 0.04)",
      wrap: false,
    },
    links: {
      color: ({ colors }) => colors.links.main,
      visited: ({ typography }) => typography.links.color,
      hover: ({ typography }) => lighten(0.2, typography.links.color),
      textDecoration: "underline",
    },
  },
  rightPanel: {
    backgroundColor: '#263238',
    width: '40%',
    // textColor: '#ffffff',
  },
  schema: {
    nestedBackground: '#fafafa',
    // linesColor: theme => lighten( theme.colors.tonalOffset, desaturate(theme.colors.tonalOffset, theme.colors.primary.main) ),
    // defaultDetailsWidth: '75%',
    // typeNameColor: theme => theme.colors.text.secondary,
    // typeTitleColor: theme => theme.schema.typeNameColor,
    // requireLabelColor: theme => theme.colors.error.main,
    // labelsTextSize: '0.9em',
    // nestingSpacing: '1em',
    // arrow: {
    //   size: '1.1em',
    //   color: theme => theme.colors.text.secondary,
    // },
  },
  // codeBlock: {
  //   backgroundColor: ({ rightPanel }) => darken(0.1, rightPanel.backgroundColor),
  //   tokens: {},
  // },
  
  components: {
    search: {
      iconColor: "#777F86",
    },
    alert: {
      borderRadius: "8px",
      heading: {
        transform: "none",
      },
      variants: {
        attention: {
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.0001 12C20.0001 16.4183 16.4183 20.0001 12 20.0001C7.58175 20.0001 4.00001 16.4183 4.00001 12C4.00001 7.58175 7.58175 4.00001 12 4.00001C16.4183 4.00001 20.0001 7.58175 20.0001 12ZM22.0001 12C22.0001 17.5229 17.5229 22.0001 12 22.0001C6.47717 22.0001 2 17.5229 2 12C2 6.47717 6.47717 2 12 2C17.5229 2 22.0001 6.47717 22.0001 12ZM10.9997 8.00012C10.9997 7.44783 11.4475 7.00011 11.9998 7.00011C12.552 7.00011 12.9998 7.44783 12.9998 8.00012C12.9998 8.5524 12.552 9.00012 11.9998 9.00012C11.4475 9.00012 10.9997 8.5524 10.9997 8.00012ZM10.9997 17.0001V10.0001H12.9998L12.9998 17.0001H10.9997Z" fill="#003D99"/></svg>',
          backgroundColor: "#E6F8FF",
          headingColor: "#003D99",
          textColor: "#003D99",
          iconColor: "#003D99",
        },
        info: {
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.0001 12C20.0001 16.4183 16.4183 20.0001 12 20.0001C7.58175 20.0001 4.00001 16.4183 4.00001 12C4.00001 7.58175 7.58175 4.00001 12 4.00001C16.4183 4.00001 20.0001 7.58175 20.0001 12ZM22.0001 12C22.0001 17.5229 17.5229 22.0001 12 22.0001C6.47717 22.0001 2 17.5229 2 12C2 6.47717 6.47717 2 12 2C17.5229 2 22.0001 6.47717 22.0001 12ZM10.9997 8.00012C10.9997 7.44783 11.4475 7.00011 11.9998 7.00011C12.552 7.00011 12.9998 7.44783 12.9998 8.00012C12.9998 8.5524 12.552 9.00012 11.9998 9.00012C11.4475 9.00012 10.9997 8.5524 10.9997 8.00012ZM10.9997 17.0001V10.0001H12.9998L12.9998 17.0001H10.9997Z" fill="#003D99"/></svg>',
          backgroundColor: "#E6F8FF",
          headingColor: "#003D99",
          textColor: "#003D99",
          iconColor: "#003D99",
        },
        error: {
          icon: '<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.0021 19.9993C16.4211 19.9993 20.0034 16.417 20.0034 11.998C20.0034 7.57897 16.4211 3.99666 12.0021 3.99666C7.58312 3.99666 4.00081 7.57897 4.00081 11.998C4.00081 16.417 7.58312 19.9993 12.0021 19.9993ZM12.0021 21.9996C17.5259 21.9996 22.0037 17.5217 22.0037 11.998C22.0037 6.47422 17.5259 1.99634 12.0021 1.99634C6.47837 1.99634 2.00049 6.47422 2.00049 11.998C2.00049 17.5217 6.47837 21.9996 12.0021 21.9996ZM13.4306 12.0121L15.9059 14.4873L14.4914 15.9018L12.0162 13.4265L9.54096 15.9018L8.12652 14.4873L10.6018 12.0121L8.12645 9.53677L9.54089 8.12233L12.0162 10.5976L14.4915 8.12233L15.906 9.53677L13.4306 12.0121Z" fill="#BD0F5A"/></svg>',
          backgroundColor: "#FFE6EB",
          headingColor: "#BD0F5A",
          textColor: "#BD0F5A",
          iconColor: "#BD0F5A",
        },
        success: {
          icon: '<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.001 12.0005C20.001 16.419 16.419 20.001 12.0005 20.001C7.58202 20.001 4.00011 16.419 4.00011 12.0005C4.00011 7.58202 7.58202 4.00011 12.0005 4.00011C16.419 4.00011 20.001 7.58202 20.001 12.0005ZM22.0011 12.0005C22.0011 17.5237 17.5237 22.0011 12.0005 22.0011C6.47739 22.0011 2 17.5237 2 12.0005C2 6.47739 6.47739 2 12.0005 2C17.5237 2 22.0011 6.47739 22.0011 12.0005ZM7.9575 11.2824L10.4325 13.7574L16.0897 8.10022L17.504 9.5145L11.4932 15.5252C10.9074 16.1111 9.95761 16.1111 9.37179 15.5252L6.54321 12.6967L7.9575 11.2824Z" fill="#006622"/></svg>',
          backgroundColor: "#F4FFE6",
          headingColor: "#006622",
          textColor: "#006622",
          iconColor: "#006622",
        },
        warning: {
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.0001 6.00001L18.9283 18.0001L5.07184 18.0001L12.0001 6.00001ZM10.268 5C11.0378 3.66666 12.9623 3.66667 13.7321 5.00001L20.6604 17.0001C21.4302 18.3334 20.4679 20.0001 18.9283 20.0001H5.07184C3.53223 20.0001 2.56998 18.3334 3.33978 17.0001L10.268 5ZM11.0001 8.99988H13.0001V13.9999H11.0001V8.99988ZM13.0001 16C13.0001 16.5523 12.5524 17 12.0001 17C11.4478 17 11.0001 16.5523 11.0001 16C11.0001 15.4477 11.4478 15 12.0001 15C12.5524 15 13.0001 15.4477 13.0001 16Z" fill="#992700"/></svg>',
          backgroundColor: "#FFF2E6",
          headingColor: "#992700",
          textColor: "#992700",
          iconColor: "#992700",
        },
      },
    },
  },
};
