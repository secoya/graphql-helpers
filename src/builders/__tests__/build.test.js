import test from 'ava';

import Registry from '../../Registry';

test(`An empty type can be built`, async t => {
  /**
   * @see https://github.com/graphql/graphql-js/issues/937#issuecomment-349887736
   * for futher info about empty types.
   */
  const newType = new Registry().buildType(`
    type Empty
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 0);
});

test(`A type can have optional fields`, async t => {
  const newType = new Registry().buildType(`
    type Simple {
      id: ID
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 1);
});

test(`A field can have a custom resolver`, async t => {
  const newType = new Registry().buildType(
    `
    type Simple {
      id: ID
      title: String
    }
  `,
    {
      id: obj => obj.foo,
    },
  );

  const fields = newType._typeConfig.fields();

  t.is(typeof fields['id']['resolve'], 'function');
  t.is(typeof fields['title']['resolve'], 'undefined');
});

test(`A field can have input arguments`, async t => {
  const newType = new Registry().buildType(`
    type Simple {
      id(foo: String): ID
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 1);
});

test(`A field can have multiple input arguments`, async t => {
  const newType = new Registry().buildType(`
    type Simple {
      id(foo: String!, bar: [ID]): ID
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 1);
});

test(`A type can have required fields`, async t => {
  const newType = new Registry().buildType(`
    type Simple {
      id: ID!
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 1);
});

test(`A type can have array fields`, async t => {
  const newType = new Registry().buildType(`
    type Simple {
      ids: [ID]
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 1);
});

test(`An type with a several fields can be built`, async t => {
  const newType = new Registry().buildType(`
    type Product {
      id: ID!
      title: String
      price: Float
      tags: [String]
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 4);
});

test(`An interface can be built`, async t => {
  const registry = new Registry();

  const newInterface = registry.buildInterface(`
    interface Node {
      id: ID!
    }
  `);

  const fields = newInterface._typeConfig.fields();

  t.is(Object.keys(fields).length, 1);
});

test(`An interface can be implemented`, async t => {
  const registry = new Registry();

  registry.createInterface(`
    interface Node {
      id: ID!
    }
  `);

  const newType = registry.createType(`
    type T implements Node {
      id: ID!
      a: String
    }
  `);

  const interfaces = newType._typeConfig.interfaces();

  t.is(1, interfaces.length);
  t.is('Node', interfaces[0].name);
});
