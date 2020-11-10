import { Request, Response } from 'express';
import Organization from 'models/Organization';
import User, { IUserSchema } from 'models/User';

// @desc    Get organization data
// @route   GET /api/v1/organizations
// @access  Private
export const organizations_get_organization = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    const organization = await Organization.findById(user.organization);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'No organization found',
      });
    }

    const members: IUserSchema[] = [];

    for await (const memberId of organization.members) {
      const member = await User.findOne(memberId, [
        '-_id',
        '-password',
        '-organization',
        '-date',
      ]);

      members.push(member as IUserSchema);
    }

    const organizationData = {
      id: organization.id,
      admin: organization.admin,
      organizationName: organization.organizationName,
      members,
    };

    return res.status(200).json({
      success: true,
      data: organizationData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Create new organization
// @route   POST /api/v1/organizations
// @access  Private
export const organizations_create_organization = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { organizationName, accessCode } = req.body;

    let organizations = await Organization.find({ organizationName });

    if (organizations.length) {
      return res.status(400).json({
        success: false,
        error: 'There is an organization with this name already',
      });
    }

    organizations = await Organization.find({ accessCode });

    if (organizations.length) {
      return res.status(400).json({
        success: false,
        error: 'Access code have to be unique. This one is already in use.',
      });
    }

    const organization = new Organization({
      organizationName,
      accessCode,
      admin: req.user.id,
      members: [req.user.id],
    });

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    const userOrganization = await Organization.findById(user.organization);

    if (userOrganization) {
      return res.status(400).json({
        success: false,
        error: 'You are a member of some organization already',
      });
    }

    user.organization = organization.id;

    await organization.save();
    await user.save();

    const organizationData = {
      id: organization.id,
      admin: organization.admin,
      organizationName: organization.organizationName,
      members: [
        {
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      ],
    };

    return res.status(201).json({
      success: true,
      data: organizationData,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      interface ErrorValue {
        message: string;
      }

      const messages = Object.values(err.errors).map(
        (val: ErrorValue | unknown) => (val as ErrorValue).message
      );

      return res.status(400).json({
        success: false,
        error: messages,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Update an organization
// @route   PUT /api/v1/organizations/:id
// @access  Private
export const organizations_update_organization = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const updatedOrganization = new Organization(req.body);
    await updatedOrganization.validate();

    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'No organization found',
      });
    }

    if (organization.admin.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You are not an administrator of this organization',
      });
    }

    const { organizationName, accessCode } = updatedOrganization;

    organization.organizationName = organizationName;
    organization.accessCode = accessCode;

    await organization.save();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      interface ErrorValue {
        message: string;
      }

      const messages = Object.values(err.errors).map(
        (val: ErrorValue | unknown) => (val as ErrorValue).message
      );

      return res.status(400).json({
        success: false,
        error: messages,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Delete an organization
// @route   DELETE /api/v1/organizations/:id
// @access  Private
export const organizations_delete_organization = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'No organization found',
      });
    }

    if (organization.admin.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You are not an administrator of this organization',
      });
    }

    const members = await User.find({ organization: organization.id });

    for await (const member of members) {
      member.organization = null;
      member.save();
    }

    await organization.remove();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Assign new member to the organization
// @route   POST /api/v1/organizations/members
// @access  Private
export const organizations_assign_member = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { accessCode } = req.body;

    const organization = await Organization.findOne({ accessCode });

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'No organization found',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    if (user.organization) {
      return res.status(400).json({
        success: false,
        error: 'You are a member of some organization already',
      });
    }

    organization.members.push(req.user.id);

    user.organization = organization.id;

    await organization.save();
    await user.save();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};
