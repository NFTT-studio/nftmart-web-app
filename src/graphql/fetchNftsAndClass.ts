import {
  gql,
} from '@apollo/client';

const FETCH_NFTS_AND_CLASS = gql`
query fetchNftsAndClass {
  nfts {
    nodes {
      nodeId,
      id,
      tokenId,
      classId,
      burned,
      createdAt,
      updatedAt,
      class {
        nodeId,
        id,
        metadata,
        name,
        description,
        transferable,
        burnable,
        createdAt,
        updatedAt,
      },
      orders {
        nodes {
          nodeId,
          id,
          currencyId,
          deadline,
          status,
          expectedPrice,
          acceptedPrice,
          deposit,
        }
      }
    },
    pageInfo {
      hasNextPage,
        hasPreviousPage,
        startCursor,
        endCursor
    },
    totalCount
  }
}
`;

export default FETCH_NFTS_AND_CLASS;
