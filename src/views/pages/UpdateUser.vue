<template>
    <CRow>
        <CCol :xs="12">
            <CCard class="mb-4">
                <CCardHeader>
                    <strong>Update Data Pengguna</strong>
                </CCardHeader>
                <CCardBody>
                    <CForm @submit.prevent="submitForm">
                        <!-- <div class="mb-3">
                            <CFormLabel for="nip">NIP</CFormLabel>
                            <CFormInput id="nip" v-model="nip" type="text" placeholder="masukkan nip" />
                        </div> -->
                        <div class="mb-3">
                            <CFormLabel for="user_full_name">Nama Lengkap Pengguna</CFormLabel>
                            <CFormInput id="user_full_name" v-model="user_full_name" type="text"
                                placeholder="masukkan nama pengguna" />
                        </div>
                        <div class="mb-3">
                            <CFormLabel for="user_email">Email Pengguna</CFormLabel>
                            <CFormInput id="user_email" v-model="user_email" type="email"
                                placeholder="masukkan email" />
                        </div>

                        <!-- Role Selection -->
                        <div class="mb-4">
                            <CFormLabel for="role_id">Role</CFormLabel>
                            <select id="role_id" v-model="userRole" class="border border-gray-300 rounded-lg p-2 w-full"
                                required>
                                <option value="">Pilih Role</option>
                                <option v-for="role in roles" :key="role.roleId" :value="role.roleId">{{ role.roleName
                                    }}</option>
                            </select>
                        </div>

                        <div v-if="isAreaRequired" class="mb-4">
                            <label for="area_id" class="block text-sm font-medium text-gray-700">Pilih Area</label>
                            <select id="area_id" v-model="selectedArea"
                                class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchOutlets">
                                <option value="">Pilih Area</option>
                                <option v-for="area in areas" :key="area.areaId" :value="area.areaId">
                                    {{ area.areaName }}
                                </option>
                            </select>
                        </div>

                        <div v-if="isOutletRequired && selectedArea" class="mb-4">
                            <label for="outlet_id" class="block text-sm font-medium text-gray-700">Pilih Outlet</label>
                            <select id="outlet_id" v-model="selectedOutlet"
                                class="border border-gray-300 rounded-lg p-2 w-full">
                                <option value="">Pilih Outlet</option>
                                <option v-for="outlet in outlets" :key="outlet.outletId"
                                    :value="parseInt(outlet.outletId)">
                                    {{ outlet.outletName }}
                                </option>

                            </select>
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
import { apiBaseUrl, apiUploadUrl } from '../../plugins/env.js'

const apiUrl = apiBaseUrl;
export default {
    data() {
        return {
            nip: this.$route.params.nip,
            user_full_name: "",
            user_email: "",
            userRole: "",
            selectedOutlet: "",
            selectedArea: "",
            outlets: [],
            areas: [],
            roles: [],
        };
    },
    created() {
        this.fetchUserData(this.nip);
        this.fetchAreas();
        this.fetchRoles();
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
        fetchUserData(nip) {
            const token = localStorage.getItem("token");
            axios
                .get(`${apiUrl}/api/users/${nip}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    const user = response.data.data;

                    // Set data pengguna
                    this.user_full_name = user.userFullName;
                    this.user_email = user.userEmail;
                    this.userRole = user.roleId;
                    this.selectedOutlet = user.outletId || "";
                    this.selectedArea = user.areaId || "";
                })
                .catch((error) => {
                    console.error("Gagal mengambil data pengguna:", error);
                });
        },

        fetchAreas() {
            const token = localStorage.getItem("token");
            axios
                .get(apiUrl + "/api/areas", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((response) => {
                    this.areas = response.data.data;
                    if (this.selectedArea) {
                        this.fetchOutlets();
                    }
                })
                .catch((error) => {
                    console.error("Gagal mengambil data area:", error);
                });
        },

        fetchOutlets() {
            const token = localStorage.getItem("token");
            axios
                .get(`${apiUrl}/api/outlets?area_id=${this.selectedArea}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((response) => {
                    this.outlets = response.data.data;
                    console.log("Outlets loaded:", this.outlets);
                })
                .catch((error) => {
                    console.error("Error fetching outlets:", error.response?.data || error.message);
                });
        },
        fetchRoles() {
            const token = localStorage.getItem("token");
            axios
                .get(apiUrl + "/api/roles", { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => (this.roles = response.data.data))
                .catch(() => (this.roles = []));
        },

        submitForm() {
            if (this.user_password !== this.password_confirmation) {
                alert("Password dan konfirmasi password tidak sama.");
                return;
            }

            const originalNip = this.$route.params.nip;
            const token = localStorage.getItem("token");
            const dataToSend = {
                // nip: this.nip,
                user_full_name: this.user_full_name,
                user_email: this.user_email,
                role_id: this.userRole, // Pastikan ini benar
                area_id: this.isAreaRequired ? this.selectedArea : null,
                outlet_id: this.isAreaRequired ? this.selectedOutlet : null,
            };

            console.log("Data yang dikirim:", dataToSend);

            axios.put(`${apiUrl}/api/users/${nip}`, dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    console.log("Pengguna berhasil diupdate:", response.data);
                    this.$router.push('/pages/users'); // Arahkan setelah berhasil
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        console.error("Gagal update pengguna:", error.response.data);
                    } else {
                        console.error("Gagal update pengguna:", error);
                    }
                });
        }
    },
};
</script>