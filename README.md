install antdesign

"One of your dependencies, babel-preset-react-app, is importing the
"@babel/plugin-proposal-private-property-in-object" package without
declaring it in its dependencies. This is currently working because
"@babel/plugin-proposal-private-property-in-object" is already in your
node_modules folder for unrelated reasons, but it may break at any time."


DO NOT INSTALL BELOW, IT IS DEPRECATED!
npm install @babel/plugin-proposal-private-property-in-object --save-dev

npm warn deprecated @babel/plugin-proposal-private-property-in-object@7.21.11: This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-private-property-in-object instead.

INSTALL THIS INSTEAD:
npm install @babel/plugin-transform-private-property-in-object --save-dev
