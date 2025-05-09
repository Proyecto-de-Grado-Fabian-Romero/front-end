"use client";

import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Upload360ImagesForm from "@/components/form/Upload360ImagesForm";
import { UploadImageResult } from "@/types/UploadImageResult";
import CreateVirtualTourForm from "@/components/form/virtualTour/CreateVirtualTourForm";

const CreateVirtualTourPage = () => {
  const searchParams = useSearchParams();
  const [publicId, setPublicId] = useState<string | null>(null);
  const [uploadResults, setUploadResults] = useState<UploadImageResult[]>([]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && !publicId) {
      setPublicId(id);
    }
  }, [searchParams, publicId]);

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      {/* {publicId && (
        <Upload360ImagesForm
          publicId={publicId}
          onUploadComplete={(results) => setUploadResults(results)}
        />
      )} */}
      <CreateVirtualTourForm uploadedImages={uploadResults} />
    </Container>
  );
};

export default CreateVirtualTourPage;
