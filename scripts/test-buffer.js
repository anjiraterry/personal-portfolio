const bufferToken = '0kOE6TnqCnZoguwh2uFopVJRWwNUo5_N2DWUT9y2lWC';
const bufferProfileId = '6a2ac2c138b557934584a7d1';

const pushQuery = `
  mutation CreatePost($text: String!, $channelId: ChannelId!, $dueAt: DateTime!) {
    createPost(
      input: {
        text: $text
        channelId: $channelId
        schedulingType: automatic
        mode: customScheduled
        dueAt: $dueAt
      }
    ) {
      ... on PostActionSuccess {
        post {
          id
        }
      }
      ... on MutationError {
        message
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
  body: JSON.stringify({
    query: pushQuery,
    variables: {
      text: 'Test scheduled tweet from code 2',
      channelId: bufferProfileId,
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() // Tomorrow
    }
  })
}).then(r => r.json()).then(d => console.log(JSON.stringify(d, null, 2))).catch(console.error);
