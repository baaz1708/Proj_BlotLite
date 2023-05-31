<template>
<router-link
    class="profile-link"
    :to="{ name: 'profile', params: { id: user.id } }"
  >
  <div class="mb-3">
    <ul class="list-group user-card">
      <li class="list-group-item" >
        <div class="d-flex w-100 justify-content-between">
            <div>
                <img :src="user.image_file" alt="User Image" class=" rounded-circle article-img"/>
                <h5 class="mb-1">@{{ user.username }}</h5>
            </div>
            <small>{{ user.email }}</small>
        </div>
        <p class="mb-1">Some content</p>
        <small class="badge rounded-pill text-bg-secondary">{{ user.id }} followers</small>
      </li>
    </ul>
  </div>
</router-link>
</template>

<script>
export default {
    name: 'UserCard',
    props: {
        user: {
        type: Object,
        required: true
        }
    },
  }

</script>

<style>
.user-card {
  transition: all 0.2s linear;
  cursor: pointer;
}
.user-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.article-img {
    height: 40px;
    width: 40px;
    margin-right: 5px;
  }

.profile-link {
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-weight: 100;
}
</style>