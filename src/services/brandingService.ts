import axios from 'axios';

// Interface for the branding API response
interface BrandingResponse {
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
  favicon?: string;
  // Add other branding properties as needed
}

/**
 * Service to interact with the Asgardeo Branding API
 */
export class BrandingService {
  private static instance: BrandingService;
  private baseUrl: string = '/api/asgardeo'; // Proxy URL for Asgardeo API

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of the BrandingService
   */
  public static getInstance(): BrandingService {
    if (!BrandingService.instance) {
      BrandingService.instance = new BrandingService();
    }
    return BrandingService.instance;
  }

  /**
   * Set the base URL for the Asgardeo API
   * @param baseUrl The base URL for the Asgardeo API
   */
  public setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the organization branding information
   * @param orgId The organization ID
   * @returns The branding information
   * @throws Error if the API call fails
   */
  public async getSubOrganizationBranding(
    orgId: string,
  ): Promise<BrandingResponse> {
    try {
      // Make the API call through our proxy to avoid CORS issues
      // Based on the documentation: https://wso2.com/asgardeo/docs/apis/organization-apis/org-branding-management/
      const response = await axios.get(
        `${this.baseUrl}/o/${orgId}/api/server/v1/branding-preference/resolve`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );
      
      // Extract the branding information from the response
      const brandingData = response.data;
      console.log(brandingData);
      const theme = brandingData.preference.theme.activeTheme;
      
      // Return the branding information in our expected format
      return {
        primaryColor: brandingData.preference.theme[theme].colors.primary.main || '',
        secondaryColor: brandingData.preference.theme[theme].colors.primary.main || '',
        logo: brandingData.logo || '',
        favicon: brandingData.favicon || '',
      };
    } catch (error: any) {
      // Log the error with more details
      console.error('Error fetching organization branding:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
      
      // Rethrow the error to be handled by the caller
      throw new Error(`Failed to fetch organization branding: ${error.message}`);
    }
  }

  /**
   * Update the organization branding information
   * @param orgId The organization ID
   * @param branding The branding information to update
   * @param accessToken The access token for authentication
   * @returns The updated branding information
   */
  public async updateOrganizationBranding(
    orgId: string,
    branding: Partial<BrandingResponse>,
    accessToken: string
  ): Promise<BrandingResponse> {
    try {
      // Make the actual API call to update branding
      const response = await axios.put(
        `${this.baseUrl}/o/${orgId}/api/server/v1/branding`,
        branding,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      
      // Return the updated branding information
      return response.data;
    } catch (error) {
      console.error('Error updating organization branding:', error);
      
      // If there's an error, return the original branding data
      return {
        ...branding,
      };
    }
  }
}

// Export a singleton instance
export const brandingService = BrandingService.getInstance();
