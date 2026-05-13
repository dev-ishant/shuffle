import { CreateListingButton } from "@/components/ui/buttons/CreateListingButton"
import { ViewDetailsButton } from "@/components/ui/buttons/ViewDetailsButton"
import { MakeOfferButton } from "@/components/ui/buttons/MakeOfferButton"
import { LoginButton } from "@/components/ui/buttons/LoginButton"
import { LogoutButton } from "@/components/ui/buttons/LogoutButton"
import { EditListingButton } from "@/components/ui/buttons/EditListingButton"
import { DeleteListingButton } from "@/components/ui/buttons/DeleteListingButton"
import { PayNowButton } from "@/components/ui/buttons/PayNowButton"
import { SearchButton } from "@/components/ui/buttons/SearchButton"
import { FilterButton } from "@/components/ui/buttons/FilterButton"
import { ClearFiltersButton } from "@/components/ui/buttons/ClearFiltersButton"
import { SaveChangesButton } from "@/components/ui/buttons/SaveChangesButton"

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h2>
      <div className="flex flex-wrap items-center gap-5 p-6 rounded-3xl
        shadow-[8px_8px_16px_#c5c7cf,-8px_-8px_16px_#ffffff]">
        {children}
      </div>
    </section>
  )
}

function ShowcasePage() {
  return (
    <div className="min-h-screen bg-[#e8eaf0] p-10 flex flex-col gap-10">

      <h1 className="text-3xl font-bold text-gray-600 tracking-tight">
        Component Showcase — Buttons
      </h1>

      <Section title="Listing Actions">
        <CreateListingButton />
        <ViewDetailsButton />
        <EditListingButton />
        <DeleteListingButton />
      </Section>

      <Section title="Offer & Payment">
        <MakeOfferButton />
        <PayNowButton />
      </Section>

      <Section title="Auth">
        <LoginButton />
        <LogoutButton />
      </Section>

      <Section title="Search & Filter">
        <SearchButton />
        <FilterButton />
        <ClearFiltersButton />
      </Section>

      <Section title="Form Actions">
        <SaveChangesButton />
      </Section>

    </div>
  )
}

export default ShowcasePage