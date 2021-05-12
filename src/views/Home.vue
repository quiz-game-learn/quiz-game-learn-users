<template>
  <div class="container">
    <v-row justify="space-around">
      <div v-if="user">
        <v-card
            class="mx-auto"
            max-width="344"
            outlined
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">
                {{ $t('User') }}
              </div>
              <v-list-item-title class="headline mb-1">
                {{ user.email }}
              </v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
                tile
                size="80"
                color="grey"
            ></v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <v-btn
                outlined
                rounded
                text
                @click="logout"
            >
              {{ $t('Logout') }}
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-btn
            outlined
            rounded
            text
            class="buttonSubmenu"
            color="teal accent-4"
            @click="availableCourses()"
        >
          <v-icon>mdi-notebook-outline</v-icon> {{ $t('Available courses') }}
        </v-btn>
      </div>

      <div v-if="!user">
        <h1 class="heading">{{$t('Seems like you are not logged in')}}</h1>
        <v-btn
            outlined
            rounded
            text
            color="teal accent-4"
            @click="login"
        >
          {{ $t('Login') }}
        </v-btn>

          <v-btn
              outlined
              rounded
              text
              color="teal accent-4"
              class="buttonlog"
              @click="register"
          >
            {{ $t('Register') }}
        </v-btn>
      </div>

    </v-row>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {auth} from "@/firebase";

@Component({
  components: {},
})
export default class Home extends Vue {
  mounted() {
    console.log(this.user)
  }

  get user() {
    return this.$store.state.user
  }

  async logout() {
    await auth.signOut()
    this.$router.push({name: 'Login'})
  }

  async login() {
    this.$router.push({name: 'Login'})
  }

  async register() {
    this.$router.push({name: 'Register'})
  }

  async availableCourses() {
    this.$router.push({name: 'Courses'})
  }
}
</script>

<style>
.container {
  margin-top: 30px;
}
.buttonlog{
  margin: 0 auto;
}
.buttonSubmenu{
  margin-top: 40px;
}
</style>