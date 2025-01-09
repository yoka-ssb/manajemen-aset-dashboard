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
                  <div v-if="errorMessage" class="text-center text-danger mb-4">{{ errorMessage }}</div>
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
import jwt_decode from 'jwt-decode';

const apiUrl = import.meta.env.VITE_API_URL;
console.log("Base url: ", import.meta.env.VITE_API_URL);
export default {
  data() {
    return {
      nip: '',
      user_password: '',
      loading: false, 
      errorMessage: '', 
    };
  },
  methods: {
    handleLogin() {
  this.loading = true; 
  this.errorMessage = '';

  axios
    .post(apiUrl + '/api/login', {
      nip: this.nip,
      user_password: this.user_password,
    })
    .then((response) => {
      const data = response.data;
      const token = data.token;
      localStorage.setItem('token', token);
      try {
        const decodedToken = jwt_decode(token);
        const roleId = decodedToken.role_id;        
        localStorage.setItem('role_id', roleId);
      } catch (error) {
        console.error('Invalid token:', error);
      }
      this.$router.push('/dashboard').then(() => {
      });
    })
    .catch((error) => {
          console.error('Login failed:', error.response);
          this.errorMessage = 'Login gagal, cek kembali nip dan password anda!';
        })
    .finally(() => {
      this.loading = false; 
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




