// components/edit/editForm.jsx
// High level form to direct data and roles to the appropriate forms
// Should take in user role and determine what allow to edit

import * as React from "react";
import NftForm from "../form/nftForm";
import CollectionForm from "../form/collectionForm";
import ArtistForm from "../form/artistForm";

export default function EditForm({ role, pageData }) {

    console.log('editform nft:', pageData.nft_id)

    if (pageData.nft_id) {
        return <NftForm nft={pageData} role={role}/>;
    } else if (pageData.collection_id) {
        return <CollectionForm collection={pageData} role={role} />;
    } else {
        return <ArtistForm initialValues={pageData} role={role} />;
    }
}
