<script setup>
import { ref } from 'vue'
import avatar from '@/assets/images/avatars/avatar.png'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL;

// Fungsi logout
const logout = async () => {
  try {
    const token = localStorage.getItem('token') // Ambil token dari localStorage

    if (!token) {
      console.error("Token not found")
      return
    }

    // Lakukan permintaan logout dengan token sebagai payload
    await axios.post(
      apiUrl + '/api/logout',
      { token }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    // Hapus data dari localStorage
    localStorage.removeItem('token')

    // Arahkan ke halaman login
    router.push('/pages/login')
  } catch (error) {
    console.error("Logout failed", error)
  }
}
</script>

<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownItem @click="logout">
        <CIcon icon="cil-lock-locked" /> Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
