import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Upload360ImagesForm from "@/components/form/Upload360ImagesForm";
import { UploadImageResult } from "@/types/UploadImageResult";

const CreateVirtualTourPage = () => {
  const searchParams = useSearchParams();
  const [publicId, setPublicId] = useState<string | null>(null);
  const [uploadResults, setUploadResults] = useState<UploadImageResult[]>([]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) setPublicId(id);
  }, [searchParams]);

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      {publicId && (
        <Upload360ImagesForm
          publicId={publicId}
          onUploadComplete={(results) => setUploadResults(results)}
        />
      )}
    </Container>
  );
};

export default CreateVirtualTourPage;
