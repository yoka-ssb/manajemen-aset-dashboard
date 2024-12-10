<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center justify-content-center" style="background-color: orange; position: relative;">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="handleLogin">
                  <h1 class="text-center">Maintenance Aset</h1>
                  <p class="text-body-secondary text-center">Kelola aset dengan mudah dan efisien</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="nip"
                      placeholder="nip"
                      autocomplete="nip"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="user_password"
                      type="password"
                      placeholder="Password"
                      autocomplete="user_password"
                    />
                  </CInputGroup>
                  <CRow class="justify-content-center">
                    <CCol :xs="6" class="d-flex justify-content-center">
                      <CButton type="submit" color="danger" class="px-4 text-white" :disabled="loading">
                        {{ loading ? 'Loading...' : 'Login' }}
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>

    <div class="ssb-text">
      SSB
      <div class="sub-text">Spesial Soto Boyolali</div>
      <div class="sub">Hj. Hesti Widodo</div>
    </div>

    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
import jwt_decode from 'jwt-decode';

export default {
  data() {
    return {
      nip: '',
      user_password: '',
      loading: false, // Tambahkan state untuk animasi loading
    };
  },
  methods: {
    handleLogin() {
  this.loading = true; // Aktifkan animasi loading

  axios
    .post('http://localhost:8080/api/login', {
      nip: this.nip,
      user_password: this.user_password,
    })
    .then((response) => {
      const data = response.data;
      const token = data.token;

      // Simpan token di localStorage
      localStorage.setItem('token', token);

      // Decode token untuk mendapatkan role_id
      try {
        const decodedToken = jwt_decode(token);
        const roleId = decodedToken.role_id; // Sesuaikan dengan struktur payload JWT Anda

        // Simpan role_id di localStorage
        localStorage.setItem('role_id', roleId);

        // console.log("Role ID saved:", roleId); // Opsional: untuk log role_id

      } catch (error) {
        console.error('Invalid token:', error);
      }

      // Navigasi ke dashboard setelah memastikan token dan role_id tersedia
      this.$router.push('/dashboard').then(() => {
        // Code to execute after navigation (optional)
      });
    })
    .catch((error) => {
      console.error('Login failed:', error.response);
      alert('Login failed, please try again.');
    })
    .finally(() => {
      this.loading = false; // Matikan animasi loading
    });
},
  },
};
</script>


<style scoped>
.wrapper {
  background-color: orange;
  position: relative;
}

.ssb-text {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 4rem;
  color: white;
  font-weight: bold;
  text-align: right;
}

.sub-text {
  font-size: 1.5rem;
  color: white;
  font-weight: normal;
}

.sub {
  font-size: 1.5rem;
  color: white;
  font-weight: normal;
}
</style>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>


