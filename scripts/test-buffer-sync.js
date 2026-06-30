const bufferToken = '0kOE6TnqCnZoguwh2uFopVJRWwNUo5_N2DWUT9y2lWC';
const bufferProfileId = '6a2ac2c138b557934584a7d1';
const bufferOrgId = '6a2abec8829607e5611af400';

const queueQuery = `
  query GetSentPosts {
    posts(
      first: 50, 
      input: { 
        organizationId: "${bufferOrgId}", 
        filter: { 
          status: [sent],
          channelIds: ["${bufferProfileId}"]
        } 
      }
    ) {
      edges {
        node {
          id
          status
          dueAt
        }
      }
    }
  }
`;

fetch('https://api.buffer.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + bufferToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: queueQuery })
}).then(r => r.json()).then(d => console.log(JSON.stringify(d, null, 2))).catch(console.error);
