const { neon } = require("@neondatabase/serverless")
const fs = require("fs")
const path = require("path")

async function runSQL() {
  const sql = neon(process.env.DATABASE_URL)

  console.log("🚀 Initializing HR database...\n")

  // Read SQL files in order
  const sqlFiles = ["01-init-hr-database.sql", "02-add-email-field.sql"]

  for (const file of sqlFiles) {
    const filePath = path.join(__dirname, file)

    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${file} (not found)`)
      continue
    }

    console.log(`📄 Running ${file}...`)
    const sqlContent = fs.readFileSync(filePath, "utf-8")

    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"))

    for (const statement of statements) {
      try {
        await sql(statement)
      } catch (error) {
        // Ignore "already exists" errors
        if (!error.message.includes("already exists")) {
          console.error(`❌ Error: ${error.message}`)
        }
      }
    }

    console.log(`✅ Completed ${file}\n`)
  }

  console.log("🎉 Database initialization complete!")
  console.log('Run "npm run dev" to start the application.\n')
}

runSQL().catch(console.error)
