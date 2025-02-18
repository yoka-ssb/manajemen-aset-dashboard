<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>Reset Password Akun Pengguna</strong>
        </CCardHeader>
        <CCardBody>
          <CForm @submit.prevent="submitForm">
            <!-- Password Baru -->
            <div class="mb-3">
              <CFormLabel for="user_password">Password Baru</CFormLabel>
              <CFormInput id="user_password" v-model="user_password" type="password"
                placeholder="Masukkan password baru" required/>
            </div>
            <!-- Konfirmasi Password -->
            <div class="mb-3">
              <CFormLabel for="new_password_confirmation">Password Baru Ulang</CFormLabel>
              <CFormInput id="new_password_confirmation" v-model="new_password_confirmation" type="password"
                placeholder="Masukkan password baru ulang" required />
              <p v-if="errors.user_password" class="text-red-500 text-sm mt-1">{{ errors.user_password }}</p>
            </div>
            <div class="flex justify-end mt-4">
              <button type="submit"
                class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center">
                Submit
              </button>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
export default {
  data() {
    return {
      nip: this.$route.params.nip,
      user_password: "",
      new_password_confirmation: "",
      errors: {} // Tambahkan state untuk menyimpan pesan error
    };
  },
  methods: {
    submitForm() {
      const token = localStorage.getItem("token");

      this.errors = {};
      if (this.user_password !== this.new_password_confirmation) {
        this.errors.user_password = "Password dan password konfirmasi tidak cocok";
        return;
      } else {
        this.errors.user_password = ""; // Hilangkan pesan error jika password cocok
      }

      const dataToSend = {
        nip: this.nip,  
        user_password: this.user_password,
        reset_token: token, 
      };

      axios
        .post(`${apiUrl}/api/reset-password`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Password berhasil direset:", response.data);
          this.$router.push("/pages/users");
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            console.error("Gagal reset password:", error.response.data);
          } else {
            console.error("Gagal reset password:", error);
          }
        });
    },
  },
};
</script>