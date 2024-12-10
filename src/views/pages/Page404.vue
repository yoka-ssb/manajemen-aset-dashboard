<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <div class="clearfix">
            <h1 class="float-start display-3 me-4">404</h1>
            <h4 class="pt-3">Oops!.</h4>
            <p class="text-body-secondary float-start">
              Tidak Ditemukan Scan Ulang!
            </p>
          </div>
          <CInputGroup class="input-prepend">
            <CInputGroupText>
              <CIcon icon="cil-magnifying-glass" />
            </CInputGroupText>
            <CFormInput type="text" placeholder="Aset tidak ditemukan?" />
            <CButton color="info" @click="navigateToScanQr">Scan QR</CButton>
          </CInputGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const navigateToScanQr = () => {
      router.push({ name: "ScanQr" }); 
    };

    return {
      navigateToScanQr,
    };
  },
};
</script>
