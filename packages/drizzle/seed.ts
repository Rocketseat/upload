import { db } from '.'
import { company, user } from './schema'

async function seed() {
  let insertedCompany

  const insertedCompanies = await db
    .insert(company)
    .values({
      name: 'Rocketseat',
      domain: 'rocketseat.team',
    })
    .onConflictDoNothing()
    .returning()

  if (insertedCompanies.length > 0) {
    insertedCompany = insertedCompanies[0]
  }

  if (!insertedCompany) {
    insertedCompany = await db.query.company.findFirst({
      where(fields, { eq }) {
        return eq(fields.domain, 'rocketseat.team')
      },
    })
  }

  if (insertedCompany) {
    await db
      .insert(user)
      .values({
        email: 'admin@rocketseat.team',
        name: 'Admin',
        image: 'https://github.com/diego3g.png',
        companyId: insertedCompany.id,
      })
      .onConflictDoNothing()
  }
}

seed()
