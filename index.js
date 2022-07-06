import { GraphQLClient, gql } from "graphql-request";
import { buildClient } from "@datocms/cma-client-node";

import pkg from "enquirer";

const { Select, Input } = pkg;

const token = "f9a235ef2e6460acc4ad04aa70976e";

const dato = buildClient({
  apiToken: token,
});

const client = new GraphQLClient("https://graphql.datocms.com/", {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

const _allProducts = gql`
  query MyQuery {
    allProducts {
      id
      slug
      description
      itemId
      price
      title
      images {
        url
      }
    }
  }
`;

const _allVendors = gql`
  query MyQuery {
    allVendors {
      name
      website
    }
  }
`;

// prompt({
//   type: "input",
//   name: "model_to_query",
//   message: "What model would you like to query?",
// }).then(async (response) => {
//   if (response.model_to_query === "products") {
//     const data = await client.request(query);
//     console.log(data);
//   } else {
//     console.log("Sorry, products is the only thing I can get right now.");
//   }
// });

// query all models
const models = await dato.itemTypes.list();
const modelNames = models.map((model) => model.name);

//descripe first question
const firstPrompt = new Select({
  name: "model",
  message: "What model would you like to work on",
  choices: modelNames,
});

//ask first question
const firstResponse = await firstPrompt.run();

const secondPrompt = new Select({
  name: "mode",
  message: "What to do to this record?",
  choices: ["Create New", "Update", "Delete"],
});

const secondResponse = await secondPrompt.run();

const createNew = secondResponse === "Create New";

const thirdPrompt = createNew
  ? new Input({})
  : new Select({
      name: "record",
      message: "Which record?",
      choices: [],
    });

if (firstResponse === "Product") {
  const { allProducts } = await client.request(_allProducts);
  thirdPromptChoices = allProducts;
} else if (firstResponse === "Vendor") {
  const { allVendors } = await client.request(_allVendors);
  thirdPromptChoices = allVendors;
}

// const thirdResponse = new Select({
//   name: "record",
//   message: "Which record?",
//   choices: secondPromptChoices
// })
