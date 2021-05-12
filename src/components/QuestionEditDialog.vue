<template>
  <v-dialog
      v-model="questionDialog"
      width="500"
  >
    <v-card>
      <v-card-title>
        {{ $t('New question') }}
      </v-card-title>

      <v-card-text>
        <div class="input">
          <v-text-field
              :label="$t('Question text')"
              outlined
              v-model="editingQuestion.questionText"
          ></v-text-field>
        </div>

        <div class="input">
          <v-text-field
              :label="$t('Question explanation')"
              outlined
              v-model="editingQuestion.explanation"
          ></v-text-field>
        </div>
        <v-divider></v-divider>
        <br/>
        <div class="subtitle-1"> {{ $t('Answers') }}
          <v-btn
              v-if="!addingQuestionNewAnswer"
              text
              @click="addNewAnswer"
          >{{ $t('Create answer') }}
          </v-btn>
        </div>
        <div v-if="addingQuestionNewAnswer">
          <v-text-field
              :label="$t('New answer')"
              outlined
              v-model="newAnswer"
          ></v-text-field>
          <v-btn
              color="primary"
              text
              @click="saveNewAnswer"
          >{{ $t('add') }}
          </v-btn>
        </div>


        <div class="input" v-for="(answer, index) in editingQuestion.answerOptions" :key="answer">
          <v-checkbox
              v-model="editingQuestion.correctAnswers"
              :label="answer"
              :value="index"
          ></v-checkbox>
          <span v-if="isCorrectAnwer(index)" class="body-1">{{ $t('(correct)') }}</span>
          <v-btn
              color="primary"
              text
              @click="removeEditingAnswer(answer, index)"
          >{{ $t('remove answer') }}
          </v-btn>
        </div>


      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            text
            @click="questionDialog = false"
        >
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn
            v-if="action==='create'"
            color="primary"
            text
            @click="createQuestion"
        >
          {{ $t('Save') }}
        </v-btn>
        <v-btn
            v-if="action==='edit'"
            color="primary"
            text
            @click="editQuestion"
        >
          {{ $t('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable */
import {Component, Prop, Vue} from 'vue-property-decorator';
import QuizCard from "@/components/CourseCard.vue";
import {Lesson} from "@/models/Lessons";
import moment from "moment";
import {Question} from "@/models/Quiz";

export default {
  name: "DeleteDialog",
  props: {
    value: Boolean,
    existingQuestion: Object,
    index: Number,
    action: String
  },
  data() {
    return {
      editingQuestion: this.initQuestion(),
      newAnswer: "",
      addingQuestionNewAnswer: false
    }
  },
  methods: {
    initQuestion() {
      if (this.existingQuestion) return this.existingQuestion
      return {questionText: "", questionNumber: this.index, explanation: "", answerOptions: [], correctAnswers: []}
    },
    createQuestion() {
      this.editingQuestion.questionNumber = this.index
      console.log(this.editingQuestion)
      this.$emit("addQuestion", this.editingQuestion)
      this.questionDialog = false
      this.newAnswer = ""
    },
    editQuestion() {
      this.editingQuestion.questionNumber = this.index
      console.log(this.editingQuestion)
      this.$emit("editQuestion", this.editingQuestion)
      this.questionDialog = false
      this.newAnswer = ""
    },
    addNewAnswer() {
      this.addingQuestionNewAnswer = true
    },
    isCorrectAnwer(index) {
      return this.editingQuestion.correctAnswers.includes(index)
    },

    saveNewAnswer() {
      this.addingQuestionNewAnswer = false
      this.editingQuestion.answerOptions.push(this.newAnswer)
      this.newAnswer = ""
    },
    removeEditingAnswer(answer, index) {
      console.log(this.editingQuestion.answerOptions)
      this.editingQuestion.answerOptions = this.editingQuestion.answerOptions.filter((ans) => ans !== answer)
      this.editingQuestion.correctAnswers = this.editingQuestion.correctAnswers.filter((ans) => ans !== index)
      console.log(this.editingQuestion.answerOptions)

      this.$forceUpdate();
      console.log(answer, index)
    }
  },
  created() {
    console.log("----x------", this.existingQuestion)
    if (this.existingQuestion) {
      this.editingQuestion = Object.assign({}, this.existingQuestion)
    } else {
      this.editingQuestion = this.initQuestion()
    }
  },
  watch: {
    existingQuestion: function (newQuestion, oldQuestion) {
     if (!newQuestion) {
       this.editingQuestion = this.initQuestion()
     } else {
       this.editingQuestion = newQuestion
     }
    }
  },
  computed: {
    questionDialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style>

</style>