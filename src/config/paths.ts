export const paths = {
  home: {
    getHref: () => '/',
  },

  app: {
    root: {
      getHref: () => '/app',
    },
  },
} as const;
