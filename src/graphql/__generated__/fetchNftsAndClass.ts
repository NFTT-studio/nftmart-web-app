/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: fetchNftsAndClass
// ====================================================

export interface fetchNftsAndClass_nfts_nodes_class {
  __typename: "Class";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: string;
  metadata: any | null;
  name: string | null;
  description: string | null;
  transferable: boolean | null;
  burnable: boolean | null;
  createdAt: any;
  updatedAt: any;
}

export interface fetchNftsAndClass_nfts_nodes {
  __typename: "Nft";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: string;
  tokenId: string | null;
  classId: string | null;
  burned: boolean | null;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads a single `Class` that is related to this `Nft`.
   */
  class: fetchNftsAndClass_nfts_nodes_class | null;
}

export interface fetchNftsAndClass_nfts_pageInfo {
  __typename: "PageInfo";
  /**
   * When paginating forwards, are there more items?
   */
  hasNextPage: boolean;
  /**
   * When paginating backwards, are there more items?
   */
  hasPreviousPage: boolean;
  /**
   * When paginating backwards, the cursor to continue.
   */
  startCursor: any | null;
  /**
   * When paginating forwards, the cursor to continue.
   */
  endCursor: any | null;
}

export interface fetchNftsAndClass_nfts {
  __typename: "NftsConnection";
  /**
   * A list of `Nft` objects.
   */
  nodes: (fetchNftsAndClass_nfts_nodes | null)[];
  /**
   * Information to aid in pagination.
   */
  pageInfo: fetchNftsAndClass_nfts_pageInfo;
  /**
   * The count of *all* `Nft` you could get from the connection.
   */
  totalCount: number;
}

export interface fetchNftsAndClass {
  /**
   * Reads and enables pagination through a set of `Nft`.
   */
  nfts: fetchNftsAndClass_nfts | null;
}
