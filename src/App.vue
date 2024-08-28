<script setup lang="ts">
import { ref } from 'vue';

type API = {
  _id: string;
  author: string;
  authorSlug: string;
  content: string;
  dateAdded: string;
  dateModified: string;
  length: number;
  tags: string[];
};

const apiUrl = 'https://api.quotable.io';

const quotes = ref<API[] | null>(null);
const error = ref(false);
const loading = ref(false);

const quoteLimit = ref<number | null>(null);
const quoteMinimumLength = ref<number | null>(null);
const quoteMaximumLength = ref<number | null>(null);
const quoteAuthor = ref<string | null>(null);
const quoteTags = ref<string[] | null>(null);

const checkForInvalidValues = () => {
  if (
    // biome-ignore format: This condition should not be formatted because of the linter suppresion.
    // biome-ignore lint/style/noNonNullAssertion: If the value is null, we use the default values as specified on line 45.
    quoteLimit.value! < 0 || quoteMinimumLength.value! < 0 || quoteMaximumLength.value! < 0
  ) {
    error.value = true;
    return false;
  }
  return true;
};

const fetchQuote = async () => {
  if (!checkForInvalidValues()) return;

  try {
    loading.value = true;
    error.value = false;

    const response = await fetch(
      `${apiUrl}/quotes/random?limit=${quoteLimit.value !== null ? quoteLimit.value : 1}&minLength=${quoteMinimumLength.value !== null ? quoteMinimumLength.value : 0}&maxLength=${quoteMaximumLength.value !== null ? quoteMaximumLength.value : 100}&author=${quoteAuthor.value !== null ? quoteAuthor.value : ''}&tags=${quoteTags.value !== null ? quoteTags.value : ''}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch quotes');
    }

    const data = await response.json();
    quotes.value = data;
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <h1>Random Quote Generator</h1>
  <div class="parameters">
    <p>Number of quotes</p>
    <input type="number" placeholder="1" v-model.number="quoteLimit" />
    <p>Minimum length</p>
    <input type="number" placeholder="0" v-model.number="quoteMinimumLength" />
    <p>Maximum length</p>
    <input type="number" placeholder="100" v-model.number="quoteMaximumLength" />
    <p>Author</p>
    <input v-model="quoteAuthor" />
    <p>Tags</p>
    <input v-model="quoteTags" />
    <button v-on:click="fetchQuote" v-bind:disabled="loading" class="generate">Generate</button>
  </div>

  <div v-if="loading">Loading...</div>
  <div v-else>
    <div v-if="quotes && !error">
      <div v-for="quote in quotes" v-bind:key="quote._id" class="quote">
        <p>{{ quote.content }}</p>
        <p><strong>- {{ quote.author }}</strong></p>
      </div>
    </div>
    <div v-else-if="error" class="error quote">An error occurred. Please try again.</div>
  </div>
</template>

<style scoped>
.parameters {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 5px;
}

.quote {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 50px;
}

.generate {
  display: flex;
  align-self: center;
}

.error {
  color: red;
}
</style>
