<template>
    <CRow>
        <CCol :xs="12">
            <CCard class="mb-4">
                <CCardHeader>
                    <strong>Tambah Data Aset</strong>
                </CCardHeader>
                <CCardBody>
                    <CForm @submit.prevent="submitForm">

                        <div class="mb-3">
                            <CFormLabel for="asset_name">Nama Aset</CFormLabel>
                            <CFormInput id="asset_name" v-model="asset_name" type="text"
                                placeholder="masukkan nama aset" />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_brand">Nama Merk</CFormLabel>
                            <CFormInput id="asset_brand" v-model="asset_brand" type="text"
                                placeholder="masukkan merk aset" />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_image">Lampiran (Gambar Aset)</CFormLabel>
                            <CFormInput id="asset_image" ref="assetImage" type="file" accept="image/*"
                                placeholder="masukkan gambar aset jpg,jpeg, png" @change="handleFileChange" />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_specification">Spesifikasi Aset</CFormLabel>
                            <CFormTextarea id="asset_specification" v-model="asset_specification" rows="3">
                            </CFormTextarea>
                        </div>

                        <div v-if="isKlasifikasiaRequired" class="mb-4">
                            <CFormLabel for="asset_classification">Pilih Klasifikasi</CFormLabel>
                            <select id="asset_classification" v-model="selectedKlasifikasi"
                                class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchKlasifikasi">
                                <option value="">Pilih Klasifikasi</option>
                                <option v-for="klasifikasi in klasifikasis" :key="klasifikasi.classificationId"
                                    :value="klasifikasi.classificationId">
                                    {{ klasifikasi.classificationName }}
                                </option>
                            </select>
                        </div>

                        <div v-if="isPersonalRequired" class="mb-4">
                            <CFormLabel for="personal_responsible_id">Pilih Penanggung Jawab</CFormLabel>
                            <select id="personal_responsible_id" v-model="selectedPersonal"
                                class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchPersonal">
                                <option value="">Pilih Penanggung Jawab</option>
                                <option v-for="personal in personals" :key="personal.personalId"
                                    :value="personal.personalId">
                                    {{ personal.personalName }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-3 flex space-x-8">
                            <div>
                                <CFormLabel for="asset_condition">Kondisi Aset</CFormLabel>
                                <div class="flex space-x-4">
                                    <CFormCheck id="Baru" v-model="asset_condition" type="radio" name="asset_condition"
                                        value="Baru" label="Baru" />
                                    <CFormCheck id="Bekas" v-model="asset_condition" type="radio" name="asset_condition"
                                        value="Bekas" label="Bekas" />
                                </div>
                            </div>

                            <div>
                                <CFormLabel for="asset_status">Status Aset</CFormLabel>
                                <div class="flex space-x-4">
                                    <CFormCheck id="Baik" v-model="asset_status" type="radio" name="asset_status"
                                        value="Baik" label="Baik" />
                                    <CFormCheck id="Buruk" v-model="asset_status" type="radio" name="asset_status"
                                        value="Buruk" label="Buruk" />
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="asset_purchase_date">Tanggal Pembelian Aset</CFormLabel>
                            <CFormInput id="asset_purchase_date" v-model="asset_purchase_date" type="date"
                                placeholder="masukkan tanggal pembelian aset" />
                        </div>

                        <div class="mb-3">
                            <CFormLabel for="classification_acquisition_value">Nilai Perolehan Aset</CFormLabel>
                            <CFormInput id="classification_acquisition_value" v-model="classification_acquisition_value"
                                type="number" placeholder="masukkan nilai perolehan" />
                        </div>

                        <div v-if="isAreaRequired" class="mb-4">
                            <CFormLabel for="area_id">Pilih Area</CFormLabel>
                            <select id="area_id" v-model="selectedArea"
                                class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchOutlets">
                                <option value="">Pilih Area</option>
                                <option v-for="area in areas" :key="area.areaId" :value="area.areaId">
                                    {{ area.areaName }}
                                </option>
                            </select>
                        </div>

                        <div v-if="isOutletRequired" class="mb-4">
                            <CFormLabel for="outlet_id">Pilih Lokasi</CFormLabel>
                            <select id="outlet_id" v-model="selectedOutlet"
                                class="border border-gray-300 rounded-lg p-2 w-full">
                                <option value="">Pilih Lokasi</option>
                                <option v-for="outlet in outlets" :key="outlet.outletId" :value="outlet.outletId">{{
                                    outlet.outletName }}</option>
                            </select>
                        </div>

                        <div v-if="isPicRequired" class="mb-4">
                            <CFormLabel for="asset_pic">Pilih PIC Aset</CFormLabel>
                            <select id="asset_pic" v-model="selectedPic"
                                class="border border-gray-300 rounded-lg p-2 w-full" @change="fetchOutlets">
                                <option value="">Pilih PIC</option>
                                <option v-for="role in PicOption" :key="role.roleId" :value="role.roleId">
                                    {{ role.roleName }}
                                </option>
                            </select>
                        </div>

                        <div class="flex justify-end mt-4">
                            <button
                                class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center"
                                type="submit">Submit</button>
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
            asset_name: "",
            asset_brand: "",
            asset_image: null,
            PicOption: [],
            selectedPic: "",
            selectedArea: "",
            selectedOutlet: "",
            selectedKlasifikasi: "",
            selectedPersonal: "",
            areas: [],
            outlets: [],
            klasifikasis: [],
            personals: [],
            asset_condition: "Baru",
            asset_purchase_date: "",
            asset_status: "",
            asset_pic: "",
            personal_responsible_id: "",
            classification_acquisition_value: "",
            isAreaRequired: true,
            isOutletRequired: true,
            isKlasifikasiaRequired: true,
            isPicRequired: true,
            isPersonalRequired: true,
        };
    },
    created() {
        this.fetchOutlets();
        this.fetchAreas();
        this.fetchPic();
        this.fetchKlasifikasi();
        this.fetchPersonal();
        this.selectedPersonal = "";
        this.asset_classification = "";
        this.asset_name = "";
        this.asset_brand = "";
        this.asset_image = null;
        this.asset_specification = "";
        this.selectedPic = "";
        this.selectedArea = "";
        this.selectedOutlet = "";
        this.asset_condition = "Baru";
        this.asset_purchase_date = "";
        this.asset_status = "Baik";
        this.classification_acquisition_value = "";
    },

    methods: {

        fetchPersonal() {
            const token = localStorage.getItem("token");
            axios
                .get("http://localhost:8080/api/personal-responsibles", { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    console.log("personal fetched:", response.data.data);
                    this.personals = response.data.data;
                })
                .catch((error) => {
                    console.error("Error fetching personal:", error);
                    this.personals = [];
                });
        },

        fetchKlasifikasi() {
            const token = localStorage.getItem("token");
            axios
                .get("http://localhost:8080/api/classifications", { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    console.log("Klasifikasi fetched:", response.data.data);
                    this.klasifikasis = response.data.data;
                })
                .catch((error) => {
                    console.error("Error fetching klasifikasi:", error);
                    this.klasifikasis = [];
                });
        },

        fetchAreas() {
            const token = localStorage.getItem("token");
            axios
                .get("http://localhost:8080/api/areas", { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    console.log("Areas fetched:", response.data.data);
                    this.areas = response.data.data;
                })
                .catch((error) => {
                    console.error("Error fetching areas:", error);
                    this.areas = [];
                });
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

        fetchPic() {
            const token = localStorage.getItem("token");
            axios
                .get("http://localhost:8080/api/roles", { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    console.log("Fetched roles:", response.data.data);
                    this.PicOption = response.data.data;
                })
                .catch((error) => {
                    console.error("Error fetching roles:", error);
                    this.PicOption = [];
                });
        },

        handleSubmit() {
            console.log("Submit button clicked");
            this.submitForm();
        },

        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.asset_image = file;
                console.log("File selected:", file);
            }
        },

        async submitForm() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token tidak ditemukan, silakan login terlebih dahulu.");
        return;
    }

    let uploadedFilePath = null; // Variabel untuk menyimpan file path gambar
    try {
        // 1. Upload gambar terlebih dahulu
        const imageFormData = new FormData();
        imageFormData.append('file', this.asset_image);

        const uploadResponse = await axios.post(`http://localhost:8081/upload?module=Master%20Aset`, imageFormData, {
            headers: {
                'X-API-KEY': 'bprfjocmaqfib592338vf',
                // 'Content-Type': 'multipart/form-data',
            },
        });

        // Ambil path gambar dari respons
        uploadedFilePath = uploadResponse.data.file_path;
        console.log("Uploaded file path:", uploadedFilePath);

        // 2. Siapkan payload untuk pengiriman data aset
        const payload = {
            asset_name: this.asset_name,
            asset_brand: this.asset_brand,
            asset_image: uploadedFilePath, // Gunakan file path dari respons
            asset_specification: this.asset_specification,
            asset_condition: this.asset_condition,
            personal_responsible_id: this.selectedPersonal,
            asset_status: this.asset_status,
            asset_purchase_date: this.asset_purchase_date,
            classification_acquisition_value: this.classification_acquisition_value,
            outlet_id: this.selectedOutlet,
            area_id: this.selectedArea,
            asset_pic: this.selectedPic,
            asset_classification: this.selectedKlasifikasi,
        };

        console.log("Payload:", payload);

        // 3. Kirim data aset
        const assetResponse = await axios.post("http://localhost:8080/api/assets", payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log("Form submitted successfully", assetResponse.data);

        // 4. Redirect setelah sukses
        this.$router.push('/pages/asets');
    } catch (error) {
        console.error("There was an error:", error.response ? error.response.data : error);

        // Jika pembuatan aset gagal, hapus gambar yang sudah diupload
        if (uploadedFilePath) {
            try {
                await axios.delete(`http://localhost:8081/delete`, {
                    headers: {
                        'X-API-KEY': 'bprfjocmaqfib592338vf',
                    },
                    data: {
                        file_path: uploadedFilePath, // Kirim path gambar untuk dihapus
                    },
                });
                console.log("Uploaded file has been rolled back successfully.");
            } catch (deleteError) {
                console.error("Failed to rollback uploaded file:", deleteError.response ? deleteError.response.data : deleteError);
            }
        }
    }
}

    }
};
</script>
