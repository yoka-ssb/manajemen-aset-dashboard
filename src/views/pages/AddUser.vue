<template>
    <CRow>
      <CCol :xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Tambah Pengguna</strong>
          </CCardHeader>
          <CCardBody>
            <CForm @submit.prevent="submitForm">
              <!-- Input Fields -->
              <div class="mb-3">
                <CFormLabel for="nip">NIP</CFormLabel>
                <CFormInput id="nip" v-model="nip" type="text" placeholder="Masukkan NIP" required />
              </div>
              <div class="mb-3">
                <CFormLabel for="user_full_name">Nama Lengkap Pengguna</CFormLabel>
                <CFormInput id="user_full_name" v-model="user_full_name" type="text" placeholder="Masukkan Nama Pengguna" required />
              </div>
              <div class="mb-3">
                <CFormLabel for="user_email">Email Pengguna</CFormLabel>
                <CFormInput id="user_email" v-model="user_email" type="email" placeholder="Masukkan Email" required />
              </div>
              <div class="mb-3">
                <CFormLabel for="user_password">Password</CFormLabel>
                <CFormInput id="user_password" v-model="user_password" type="password" placeholder="Masukkan Password" required />
              </div>
              <div class="mb-3">
                <CFormLabel for="password_confirmation">Konfirmasi Password</CFormLabel>
                <CFormInput id="password_confirmation" v-model="password_confirmation" type="password" placeholder="Konfirmasi Password" required />
              </div>
  
              <!-- Role Selection -->
              <div class="mb-4">
                <CFormLabel for="role_id">Role</CFormLabel>
                <select id="role_id" v-model="userRole" class="border border-gray-300 rounded-lg p-2 w-full" required>
                  <option value="">Pilih Role</option>
                  <option v-for="role in roles" :key="role.roleId" :value="role.roleId">{{ role.roleName }}</option>
                </select>
              </div>
  
              <!-- Conditional Fields -->
              <div v-if="isAreaRequired" class="mb-4">
                <CFormLabel for="area_id">Pilih Area</CFormLabel>
                <select id="area_id" v-model="selectedArea" class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchOutlets">
                  <option value="">Pilih Area</option>
                  <option v-for="area in areas" :key="area.areaId" :value="area.areaId">{{ area.areaName }}</option>
                </select>
              </div>
  
              <div v-if="isOutletRequired" class="mb-4">
                <CFormLabel for="outlet_id">Pilih Outlet</CFormLabel>
                <select id="outlet_id" v-model="selectedOutlet" class="border border-gray-300 rounded-lg p-2 w-full">
                  <option value="">Pilih Outlet</option>
                  <option v-for="outlet in outlets" :key="outlet.outletId" :value="outlet.outletId">{{ outlet.outletName }}</option>
                </select>
              </div>
  
              <!-- Submit Button -->
              <div class="flex justify-end mt-4">
                <button type="submit" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
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
  
  export default {
    data() {
      return {
        nip: "",
        user_full_name: "",
        user_email: "",
        user_password: "",
        password_confirmation: "",
        userRole: "",
        selectedArea: "",
        selectedOutlet: "",
        areas: [],
        outlets: [],
        roles: []
      };
    },
    computed: {
      isAreaRequired() {
        return this.userRole === 5 || this.userRole === 6;
      },
      isOutletRequired() {
        return this.userRole === 6;
      }
    },
    methods: {
      fetchAreas() {
        const token = localStorage.getItem("token");
        axios
          .get("http://localhost:8080/api/areas", { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => (this.areas = response.data.data))
          .catch(() => (this.areas = []));
      },
      fetchOutlets() {
        if (!this.selectedArea) return;
        const token = localStorage.getItem("token");
        axios
          .get(`http://localhost:8080/api/outlets?area_id=${this.selectedArea}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then((response) => (this.outlets = response.data.data))
          .catch(() => (this.outlets = []));
      },
      fetchRoles() {
        const token = localStorage.getItem("token");
        axios
          .get("http://localhost:8080/api/roles", { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => (this.roles = response.data.data))
          .catch(() => (this.roles = []));
      },
      submitForm() {
        if (this.user_password !== this.password_confirmation) {
          alert("Password dan konfirmasi password tidak sama.");
          return;
        }
        const token = localStorage.getItem("token");
        const payload = {
          nip: this.nip,
          user_full_name: this.user_full_name,
          user_email: this.user_email,
          user_password: this.user_password,
          role_id: this.userRole,
          area_id: this.isAreaRequired ? this.selectedArea : null,
          outlet_id: this.isOutletRequired ? this.selectedOutlet : null
        };
        axios
          .post("http://localhost:8080/api/users", payload, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(() => this.$router.push("/pages/users"))
          .catch((error) => console.error("Gagal menambah pengguna:", error));
      }
    },
    mounted() {
      this.fetchRoles();
      this.fetchAreas();
    }
  };
  </script>
  