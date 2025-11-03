const supabaseClient = supabase.createClient(
    "https://queftwxqyuinynpsixqa.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZWZ0d3hxeXVpbnlucHNpeHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTQ5NDEsImV4cCI6MjA3NTQ5MDk0MX0.TWex1aIXHoopzD9q1LR2hOt6hsBY6JN3aAtaXpvM5hc"
  );

  async function navbarSignOut() {
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (user) {
      document.querySelector(".loginNav").textContent = "SignOut";
      document.querySelector(".loginNav").onclick = async () => {
        await supabaseClient.auth.signOut();
        alert("Sign Out Successfully!");
        location.reload();
      };
    }
  }
  navbarSignOut();