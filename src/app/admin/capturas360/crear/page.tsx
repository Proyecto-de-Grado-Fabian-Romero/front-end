"use client";

import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Upload360ImagesForm from "@/components/form/Upload360ImagesForm";
import { UploadImageResult } from "@/types/UploadImageResult";
import CreateVirtualTourForm from "@/components/form/virtualTour/CreateVirtualTourForm";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/types/Users";
import CenteredLayout from "@/components/layouts/CenteredLayout";
import { Suspense } from "react";

const CreateVirtualTourPageContent = () => {
  const searchParams = useSearchParams();
  const [publicId, setPublicId] = useState<string | null>(null);
  const [environmentId, setEnvironmentId] = useState<string | null>(null);
  const [uploadResults, setUploadResults] = useState<UploadImageResult[]>([]);
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user.role !== UserRole.Admin) router.replace(`/`);
  }, [router, user.role]);

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
    <CenteredLayout>
      <Typography mb={4} mt={12} variant="h4">
        Subir Recorrido 360
      </Typography>
      {publicId && uploadResults.length === 0 && (
        <Upload360ImagesForm
          onUploadComplete={(results) => setUploadResults(results)}
        />
      )}

      {uploadResults.length > 0 && (
        <CreateVirtualTourForm
          uploadedImages={uploadResults}
          environmentPublicId={environmentId ?? ""}
          publicId={publicId ?? ""}
        />
      )}
    </CenteredLayout>
  );
};

const CreateVirtualTourPage = () => {
  return (
    <Suspense fallback={<Typography mt={12}>Cargando...</Typography>}>
      <CreateVirtualTourPageContent />
    </Suspense>
  );
};

export default CreateVirtualTourPage;
