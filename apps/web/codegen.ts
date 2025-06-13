import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://10.1.9.101:30699/graphql', // endpoint จาก backend
  documents: ['./src/lib/graphql/**/*.ts'],
  generates: {
    './src/lib/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },
};

export default config;
