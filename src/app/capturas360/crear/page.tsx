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
  const [environmentId, setEnvironmentId] = useState<string | null>(null);
  const [uploadResults, setUploadResults] = useState<UploadImageResult[]>([]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && !publicId) {
      setPublicId(id);
    }
  }, [searchParams, publicId]);

  useEffect(() => {
    const id = searchParams.get("environmentId");
    if (id && !environmentId) {
      setEnvironmentId(id);
    }
  }, [searchParams, environmentId]);

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      {publicId && uploadResults.length === 0 && (
        <Upload360ImagesForm
          onUploadComplete={(results) => setUploadResults(results)}
        />
      )}

      {uploadResults.length > 0 && (
        <CreateVirtualTourForm
          uploadedImages={uploadResults}
          environmentPublicId={environmentId ?? ""}
        />
      )}
    </Container>
  );
};

export default CreateVirtualTourPage;
