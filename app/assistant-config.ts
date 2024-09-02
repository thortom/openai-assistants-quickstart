export let assistantId = "asst_15DzgalkRpZFYO9uc7IEvHTo"; // "asst_dj8iKIlbrCxwBsNzUqNkps4e"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
