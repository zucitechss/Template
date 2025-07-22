module.exports = {
    presets: [
      '@babel/preset-env', // Ensures compatibility with modern JavaScript features
      '@babel/preset-react', // Ensures JSX is compiled properly
      'next/babel', // For Next.js specific configurations
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'], // Set the root to the src folder
          alias: {
            '@': './src', // Define the alias @ for the src directory
          },
        },
      ],
    ],
  };
  