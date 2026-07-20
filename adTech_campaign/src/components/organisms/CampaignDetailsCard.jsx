import { Button } from "../atoms/Button";
import { InfoItem } from "../molecules/InfoItem";
import { formatCurrency } from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";

export function CampaignDetailsCard({ campaign, onDelete, editPath, backPath = "/campaigns", canManage = true }) {
  const navigate = useNavigate();
  const campaignName = campaign.campaignName || campaign.name || "Untitled Campaign";
  const createdDate = campaign.createdAt
    ? new Date(campaign.createdAt).toLocaleDateString("en-IN")
    : "Not available";
  const updatedDate = campaign.updatedAt
    ? new Date(campaign.updatedAt).toLocaleString("en-IN")
    : "Not updated yet";

  return (
    <article className="box-border w-full min-w-0 max-w-5xl overflow-hidden rounded-xl border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-600 landscape:p-3 sm:p-5 sm:landscape:p-4 lg:p-6">

      <h2 className="mb-4 break-words text-xl font-bold text-gray-900 landscape:mb-3 sm:text-2xl">
        Campaign Details
      </h2>

      <section className="min-w-0 rounded-lg border border-blue-100 bg-blue-50/70 p-3 landscape:py-2 sm:p-4" aria-labelledby="campaign-description-heading">
        <h3 id="campaign-description-heading" className="text-sm font-bold uppercase tracking-wide text-blue-900">
          About this campaign
        </h3>
        <p className="mt-2 max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-6 text-gray-700 sm:text-base">
          {campaign.description || "No campaign description has been provided."}
        </p>
      </section>

      <div className="mt-3 grid min-w-0 grid-cols-1 gap-x-5 landscape:grid-cols-2 sm:gap-x-8 sm:grid-cols-2">
        <InfoItem label="Campaign ID" value={campaign.id} />
        <InfoItem label="Campaign Name" value={campaignName} />
        <InfoItem label="Platform" value={campaign.platform} />
        <InfoItem label="Budget" value={formatCurrency(campaign.budget)} />
        <InfoItem label="Status" value={campaign.status} />
        <InfoItem label="Age Group" value={campaign.ageGroup || "All"} />
        <InfoItem label="Created Date" value={createdDate} />
        <InfoItem label="Last Updated" value={updatedDate} />
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-4 landscape:mt-4 landscape:flex-row landscape:flex-wrap landscape:pt-3 sm:flex-row sm:flex-wrap sm:gap-3">

        <Button
          variant="secondary"
          className="campaign-details-back-button w-full landscape:w-auto sm:w-auto"
          onClick={() => navigate(backPath)}
        >
          Back
        </Button>

        {canManage && <Button
          className="w-full landscape:w-auto sm:w-auto"
          onClick={() =>
            navigate(editPath || `/campaigns/edit/${campaign.id}`)
          }
        >
          Edit
        </Button>}

        {canManage && <Button
          variant="danger"
          className="w-full landscape:w-auto sm:w-auto"
          onClick={onDelete}
        >
          Delete
        </Button>}

      </div>

    </article>
  );
}
